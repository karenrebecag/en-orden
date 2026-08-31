import { loadConfig, readInput } from "../../.cursor/lib/config.mjs";
import { evaluar, mensajes } from "../../.cursor/lib/guard.mjs";

// Adaptador de Claude Code (PreToolUse sobre Bash). La decision vive en
// .cursor/lib/guard.mjs, compartida con el adaptador de Cursor: un solo candado.
//
// Protocolo: entra { tool_name, tool_input: { command } } y sale
// { hookSpecificOutput: { hookEventName, permissionDecision, permissionDecisionReason } }.

function responder(payload) {
  if (payload) process.stdout.write(JSON.stringify(payload));
  process.exit(0);
}

const decision = (permissionDecision, permissionDecisionReason) => ({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision,
    ...(permissionDecisionReason ? { permissionDecisionReason } : {}),
  },
});

const input = await readInput();
const config = loadConfig();

if (config._error) {
  responder(
    decision(
      "ask",
      `project.config.json no se pudo leer (${config._error}). Revisa el archivo antes de continuar.`
    )
  );
}

// Solo se revisan comandos de terminal. Lo demas no pasa por aqui.
if (input.tool_name !== "Bash") responder(null);

const raw = String(input.tool_input?.command || "");
const hit = evaluar(raw, config);

if (!hit) responder(null);

const { persona, agente } = mensajes(hit, raw);

// La razon la lee el modelo y tambien se le muestra a la persona, asi que
// lleva las dos mitades: que se bloqueo y que tiene que hacer el agente.
responder(
  decision(hit.permission === "ask" ? "ask" : "deny", `${persona}\n\n${agente}`)
);
