import { resolve, isAbsolute } from "node:path";
import { ROOT } from "./config.mjs";

// La decision de bloquear vive aqui, una sola vez, porque el espacio corre en
// dos editores y dos copias de esta logica serian dos candados distintos: el
// dia que uno se actualice y el otro no, el que se quedo atras es una mentira.
// Los hooks de cada editor son adaptadores delgados que traducen su protocolo.
//
// El comando se parte en fragmentos (lineas, ;, &&, |, $(), backticks), a cada
// fragmento se le quitan los envoltorios (sudo, env, bash -c, eval...) y las
// reglas se evaluan ancladas al inicio del comando real. Asi "cd x && git push",
// "bash -c 'git push'" y un script multilinea caen igual que "git push" a secas.
// Esto detiene el descuido del agente; no es un sandbox contra intencion.

const WRAPPERS =
  /^(?:sudo|command|nohup|time|eval|env(?:\s+\w+=(?:"[^"]*"|'[^']*'|\S*))*|xargs(?:\s+-\w+)*|(?:ba|z|da)?sh\s+-c)\s+/i;

function fragments(command) {
  return command
    .split(/(?:\r?\n|;|&&|\|\||\||&|\$\(|`)+/)
    .map((f) => f.trim())
    .filter(Boolean);
}

function normalize(fragment) {
  let f = fragment;
  for (;;) {
    const before = f;
    f = f.replace(/^\w+=(?:"[^"]*"|'[^']*'|\S*)\s+/, ""); // FOO=bar cmd
    f = f.replace(WRAPPERS, "");
    f = f.replace(/^["']|["']$/g, "");
    f = f.trim();
    if (f === before) break;
  }
  return f;
}

// mv/cp/ln/rsync con algun extremo fuera de la carpeta del proyecto. Bloquea en
// los dos sentidos a proposito: nada sale, y nada entra por un comando. Traer un
// export de otro sistema lo hace la persona a mano (ver la skill /migrar).
function escapesRoot(cmd) {
  const m = cmd.match(/^(mv|cp|ln|rsync)\s+(.+)$/i);
  if (!m) return false;
  const args = m[2].match(/(?:"[^"]*"|'[^']*'|\S+)/g) || [];
  return args.some((tok) => {
    if (tok.startsWith("-")) return false;
    let a = tok.replace(/^["']|["']$/g, "");
    if (a.startsWith("~")) a = a.replace(/^~/, process.env.HOME || "~");
    const abs = isAbsolute(a) ? resolve(a) : resolve(ROOT, a);
    return !abs.startsWith(resolve(ROOT));
  });
}

/**
 * Evalua un comando contra las reglas del espacio.
 * Devuelve null si se permite, o { id, permission: "deny"|"ask", reason }.
 */
export function evaluar(rawCommand, config) {
  if (!config.guard.enabled) return null;

  const raw = String(rawCommand || "");
  if (!raw.trim()) return null;

  const frags = fragments(raw).map(normalize).filter(Boolean);
  // Las reglas se prueban contra el comando crudo (flag m: cada linea cuenta
  // como inicio) y contra cada fragmento normalizado.
  const targets = [raw, ...frags];

  let hit = null;
  for (const rule of config.guard.rules) {
    let re;
    try {
      re = new RegExp(rule.pattern, "im");
    } catch {
      continue;
    }
    if (targets.some((t) => re.test(t))) {
      if ((rule.permission || "deny") === "deny") return rule;
      hit = hit || rule;
    }
  }

  // Reglas incorporadas que una regex de config no puede expresar.
  for (const f of frags) {
    if (/^[$]/.test(f)) {
      hit = hit || {
        id: "variable-como-comando",
        permission: "ask",
        reason: "El comando se esconde detras de una variable y no se puede revisar.",
      };
    } else if (
      /^\S+\.(?:sh|bash|zsh|command)(?:\s|$)/i.test(f) ||
      // interprete con archivo: "sh x.sh", "bash ./y". El caso -c ya fue desenvuelto.
      /^(?:(?:ba|z|da)?sh|source)\s+\S/i.test(f)
    ) {
      hit = hit || {
        id: "script-arbitrario",
        permission: "ask",
        reason: "Ejecutar un script hace de golpe todo lo que el script contenga.",
      };
    } else if (escapesRoot(f)) {
      return {
        id: "mover-fuera",
        permission: "deny",
        reason:
          "Nada entra ni sale de la carpeta de este espacio por un comando. Mover o copiar archivos lo hace la persona a mano.",
      };
    }
  }

  return hit;
}

/** Los dos mensajes de un bloqueo: uno para la persona, otro para el agente. */
export function mensajes(hit, raw) {
  if (hit.permission === "ask") {
    return {
      persona: `Regla "${hit.id}": ${hit.reason}\n\nComando: ${raw}\n\nApruebalo solo si entiendes que hace.`,
      agente: `El comando requiere aprobacion de la persona (regla "${hit.id}": ${hit.reason}). Explica en una linea que hace y espera.`,
    };
  }
  return {
    persona: `Bloqueado por la regla "${hit.id}": ${hit.reason}\n\nComando: ${raw}\n\nSi lo quieres correr, hazlo tu en la terminal o desactiva la regla en project.config.json.`,
    agente: `El comando fue bloqueado por la regla "${hit.id}". Motivo: ${hit.reason} No intentes rodear el bloqueo con otra sintaxis, otro envoltorio ni un script. Explica a la persona que querias hacer y por que, y espera a que lo autorice.`,
  };
}
