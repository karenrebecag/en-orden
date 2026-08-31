import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadConfig, readInput, respond } from "../lib/config.mjs";
import { isRepo } from "../lib/history.mjs";

// Inyecta el estado del trabajo al abrir sesion, para que el agente no empiece
// preguntando lo que ya esta escrito. Se mantiene corto: entra en cada prompt.
await readInput();
const config = loadConfig();

const lines = [];

if (config._missing) {
  lines.push(
    "AVISO: falta project.config.json en la raiz. Las verificaciones y los bloqueos estan apagados. " +
      "Dile a la persona que restaure ese archivo desde la plantilla antes de trabajar."
  );
}

// 1500 caracteres es el presupuesto del estado en cada prompt. Si se pasa, lo
// peor seria recortar en silencio: las Decisiones viejas desaparecerian sin que
// nadie lo note. Se recorta igual, pero avisando para que /semana lo compacte.
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

// entrada/ llena es la senal de que toca /ordenar antes que cualquier otra cosa.
const entradaDir = join(ROOT, "entrada");
if (existsSync(entradaDir)) {
  const items = readdirSync(entradaDir).filter((f) => !f.startsWith(".") && f !== "README.md");
  if (items.length > 0) {
    lines.push(
      `entrada/ tiene ${items.length} elemento(s) sin clasificar. Si la persona no pide otra cosa, sugiere /ordenar.`
    );
  }
}

// Un auto-git configurado pero sin repo falla en silencio, que es el peor
// de los estados: la persona cree que tiene puntos de restauracion y no los tiene.
if (config.versioning === "auto-git" && !isRepo()) {
  lines.push(
    "CRITICO: versioning esta en auto-git pero este espacio no tiene historial. " +
      "No se estan guardando puntos de restauracion. Antes de editar cualquier cosa, " +
      "dile a la persona que corra /historial."
  );
} else if (config.versioning !== "auto-git") {
  lines.push(
    "Este espacio no tiene puntos de restauracion automaticos. " +
      "Antes de un cambio amplio, avisa a la persona que no habra forma de deshacerlo entre sesiones."
  );
}

respond(lines.length > 0 ? { additional_context: lines.join("\n\n") } : {});
