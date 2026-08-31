import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadConfig } from "./config.mjs";
import { readJournal, clearJournal } from "./journal.mjs";
import { runChecks, formatReport } from "./checks.mjs";
import { snapshot, borradosGrandes } from "./history.mjs";
import { filtrarNuevos, registrarMostrados } from "./avisos.mjs";

// El cierre del turno vive aqui, una sola vez, igual que el candado: los dos
// editores lo comparten y cada uno pone un adaptador que traduce su protocolo.
// Cursor entrega el numero de intento; Claude Code solo dice si ya bloqueo
// antes, asi que el contador lo llevamos nosotros en state/intentos.json.

export const MAX_LOOPS = 3;
const CONTADOR = join(ROOT, "state", "intentos.json");

export function leerIntentos() {
  if (!existsSync(CONTADOR)) return 0;
  try {
    return Number(JSON.parse(readFileSync(CONTADOR, "utf8")).intentos) || 0;
  } catch {
    return 0;
  }
}

export function guardarIntentos(n) {
  try {
    writeFileSync(CONTADOR, JSON.stringify({ intentos: n }) + "\n", "utf8");
  } catch {
    // sin contador el gate sigue funcionando, solo pierde la cuenta
  }
}

const MAX_LINEAS_AVISO = 10;

const lineasDeAviso = (f) => {
  const lines = f.output
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) => l && !/^\[\.\.\.salida recortada\.\.\.\]$/.test(l) && !/^\d+ problema\(s\)\.$/.test(l)
    );
  const shown = lines.slice(0, MAX_LINEAS_AVISO).map((l) => `  - ${f.name}: ${l}`);
  if (lines.length > MAX_LINEAS_AVISO) {
    shown.push(`  - ${f.name}: y ${lines.length - MAX_LINEAS_AVISO} aviso(s) mas`);
  }
  return shown;
};

/**
 * Decide si el turno puede cerrarse.
 * Devuelve { accion: "nada" | "bloquear" | "avisar", mensaje }.
 * `loop` es el numero de intentos ya hechos en este turno.
 */
export function evaluarCierre(loop) {
  const config = loadConfig();
  const journal = readJournal();
  if (journal.files.length === 0) return { accion: "nada" };

  const fileList = journal.files.map((f) => f.path);

  if (loop >= MAX_LOOPS) {
    // Rendirse sin guardar nada dejaba el trabajo del turno sin punto de
    // restauracion justo en el turno que salio mal. Se guarda marcado.
    if (config.versioning === "auto-git") {
      snapshot(`SIN VERIFICAR - ${fileList.slice(0, 3).join(", ") || "cambios del agente"}`);
    }
    clearJournal();
    return {
      accion: "avisar",
      mensaje:
        `Se alcanzo el limite de ${MAX_LOOPS} intentos automaticos y las verificaciones siguen fallando. ` +
        `Detente. No sigas editando. Se guardo un punto de restauracion marcado como SIN VERIFICAR para no perder el trabajo. ` +
        `Resume a la persona en cinco lineas: que intentaste, que verificacion sigue en rojo, ` +
        `cual es tu mejor hipotesis, y que necesitas de ella para desbloquearlo.`,
    };
  }

  const { results, blockingFailures, advisoryFailures, configured } = runChecks(config, {
    files: fileList,
  });
  const smells = journal.files.filter((f) => f.notes.length > 0);

  if (!configured && smells.length === 0) {
    clearJournal();
    return { accion: "nada" };
  }

  if (blockingFailures.length > 0) {
    const detail = blockingFailures
      .map((f) => `### ${f.name}\ncomando: ${f.command}\n\n${f.output}`)
      .join("\n\n");

    return {
      accion: "bloquear",
      mensaje:
        `El turno no puede cerrarse: ${blockingFailures.length} verificacion(es) obligatorias fallan ` +
        `en los archivos que tocaste.\n\n` +
        `Archivos que tocaste:\n${fileList.map((f) => `  - ${f}`).join("\n")}\n\n` +
        `${formatReport(results)}\n\n${detail}\n\n` +
        `Arregla la causa, no el sintoma: no borres el enlace, la tarea o el criterio para que la verificacion pase. ` +
        `Si crees que la verificacion esta mal, dilo explicitamente antes de tocar nada. Intento ${loop + 1} de ${MAX_LOOPS}.`,
    };
  }

  const avisos = [
    ...advisoryFailures.flatMap(lineasDeAviso),
    ...smells.map((f) => `  - ${f.path}: ${f.notes.join(", ")}`),
    ...borradosGrandes(fileList).map(
      (b) =>
        `  - ${b.path}: se borraron ${b.borradas} lineas y se agregaron ${b.agregadas}. Si fue a proposito, dilo en una linea; si no, se recupera desde el historial`
    ),
  ];

  // Un aviso repetido en cada turno deja de leerse y entrena a ignorarlos todos.
  const nuevos = filtrarNuevos(avisos);

  if (nuevos.length > 0) {
    registrarMostrados(nuevos);
    clearJournal();
    return {
      accion: "avisar",
      mensaje:
        `Las verificaciones obligatorias pasan. Quedan avisos que no detienen el trabajo, ` +
        `pero conviene resolver antes de dar el turno por cerrado:\n\n` +
        nuevos.join("\n") +
        `\n\nCorrigelos o justifica en una linea por que se quedan. No volveran a salir hoy.`,
    };
  }

  if (config.versioning === "auto-git") {
    const result = snapshot(fileList.slice(0, 3).join(", ") || "cambios del agente");

    if (!result.ok && result.reason === "no-repo") {
      clearJournal();
      return {
        accion: "avisar",
        mensaje:
          "Las verificaciones pasan, pero no se guardo ningun punto de restauracion: este espacio " +
          "no tiene historial y versioning esta en auto-git. Detente y dile a la persona que " +
          "corra /historial antes de seguir trabajando.",
      };
    }

    if (result.ok) console.error(`[stop-gate] punto de restauracion ${result.sha}`);
  }

  clearJournal();
  return { accion: "nada" };
}

/** Contexto de arranque de sesion, compartido por los dos editores. */
export function contextoDeArranque({ incluirReglas = false } = {}) {
  const config = loadConfig();
  const lines = [];

  if (config._missing) {
    lines.push(
      "AVISO: falta project.config.json en la raiz. Las verificaciones y los bloqueos estan apagados. " +
        "Dile a la persona que restaure ese archivo desde la plantilla antes de trabajar."
    );
  }

  // Las reglas viven una sola vez en .cursor/rules/. Cursor las carga solo por su
  // frontmatter; Claude Code no lee ese formato, asi que se le inyectan aqui en
  // vez de copiarlas a otro archivo que envejeceria por separado.
  if (incluirReglas) {
    for (const nombre of ["00-core.mdc", "30-privacidad.mdc"]) {
      const ruta = join(ROOT, ".cursor", "rules", nombre);
      if (!existsSync(ruta)) continue;
      const texto = readFileSync(ruta, "utf8").replace(/^---[\s\S]*?---\n/, "").trim();
      if (texto) lines.push(texto);
    }
  }

  const statePath = join(ROOT, "state", "workflow_state.md");
  if (existsSync(statePath)) {
    const state = readFileSync(statePath, "utf8").trim();
    const MAX_STATE = 1500;
    if (state && state.length > MAX_STATE) {
      lines.push(
        `AVISO: workflow_state.md tiene ${state.length} caracteres y solo entran ${MAX_STATE}; lo que sigue esta RECORTADO ` +
          `y puede faltar contexto. Propon /semana para compactarlo antes de trabajar.\n\n` +
          "Estado actual del trabajo (recortado):\n" +
          state.slice(0, MAX_STATE)
      );
    } else if (state) {
      lines.push("Estado actual del trabajo:\n" + state);
    }
  }

  const entradaDir = join(ROOT, "entrada");
  if (existsSync(entradaDir)) {
    const items = readdirSync(entradaDir).filter((f) => !f.startsWith(".") && f !== "README.md");
    if (items.length > 0) {
      lines.push(
        `entrada/ tiene ${items.length} elemento(s) sin clasificar. Si la persona no pide otra cosa, sugiere /ordenar.`
      );
    }
  }

  return { lines, config };
}
