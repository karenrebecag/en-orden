import { loadConfig, readInput, respond } from "../lib/config.mjs";
import { evaluar, mensajes } from "../lib/guard.mjs";

// Adaptador de Cursor (beforeShellExecution). La decision vive en lib/guard.mjs,
// compartida con el adaptador de Claude Code: un solo candado, dos editores.

const input = await readInput();
const config = loadConfig();

if (config._error) {
  respond({
    permission: "ask",
    user_message: `project.config.json no se pudo leer (${config._error}). Revisa el archivo antes de continuar.`,
  });
}

const raw = String(input.command || "");
const hit = evaluar(raw, config);

if (!hit) respond({});

const { persona, agente } = mensajes(hit, raw);

respond({
  permission: hit.permission === "ask" ? "ask" : "deny",
  user_message: persona,
  agent_message: agente,
});
