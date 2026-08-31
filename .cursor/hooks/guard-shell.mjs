import { resolve, isAbsolute } from "node:path";
import { ROOT, loadConfig, readInput, respond } from "../lib/config.mjs";

// beforeShellExecution: unico punto donde una prohibicion se puede hacer cumplir.
// El comando se parte en fragmentos (lineas, ;, &&, |, $(), backticks), a cada
// fragmento se le quitan los envoltorios (sudo, env, bash -c, eval...) y las
// reglas se evaluan ancladas al inicio del comando real. Asi "cd x && git push",
// "bash -c 'git push'" y un script multilinea caen igual que "git push" a secas.
// Esto detiene el descuido del agente; no es un sandbox contra intencion.

const input = await readInput();
const config = loadConfig();

if (config._error) {
  respond({
    permission: "ask",
    user_message: `project.config.json no se pudo leer (${config._error}). Revisa el archivo antes de continuar.`,
  });
}

if (!config.guard.enabled) respond({});

const raw = String(input.command || "");
if (!raw.trim()) respond({});

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

// mv/cp/ln/rsync con un destino fuera de la carpeta del proyecto.
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
    if ((rule.permission || "deny") === "deny") {
      hit = rule;
      break;
    }
    hit = hit || rule;
  }
}

// Reglas incorporadas que una regex de config no puede expresar.
if (!hit || hit.permission === "ask") {
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
      hit = {
        id: "mover-fuera",
        permission: "deny",
        reason: "Nada sale de la carpeta de este espacio. Mover o copiar hacia afuera lo hace la persona a mano.",
      };
      break;
    }
  }
}

if (!hit) respond({});

if (hit.permission === "ask") {
  respond({
    permission: "ask",
    user_message: `Regla "${hit.id}": ${hit.reason}\n\nComando: ${raw}\n\nApruebalo solo si entiendes que hace.`,
    agent_message: `El comando requiere aprobacion de la persona (regla "${hit.id}": ${hit.reason}). Explica en una linea que hace y espera.`,
  });
}

respond({
  permission: "deny",
  user_message: `Bloqueado por la regla "${hit.id}": ${hit.reason}\n\nComando: ${raw}\n\nSi lo quieres correr, hazlo tu en la terminal o desactiva la regla en project.config.json.`,
  agent_message: `El comando fue bloqueado por la regla "${hit.id}". Motivo: ${hit.reason} No intentes rodear el bloqueo con otra sintaxis, otro envoltorio ni un script. Explica a la persona que querias hacer y por que, y espera a que lo autorice.`,
});
