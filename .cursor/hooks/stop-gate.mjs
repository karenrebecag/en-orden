import { loadConfig, readInput, respond } from "../lib/config.mjs";
import { readJournal, clearJournal } from "../lib/journal.mjs";
import { runChecks, formatReport } from "../lib/checks.mjs";
import { snapshot } from "../lib/history.mjs";

// Este hook es el que cierra el ciclo. `followup_message` reinyecta al agente
// automaticamente, asi que un turno no puede terminar con el espacio roto.
// MAX_LOOPS debe ser menor que loop_limit en hooks.json: el mensaje de
// rendicion se emite en el intento MAX_LOOPS y necesita un loop libre para llegar.
const MAX_LOOPS = 3;

const input = await readInput();
const config = loadConfig();

if (input.status !== "completed") respond({});

const journal = readJournal();
if (journal.files.length === 0) respond({});

const loop = Number(input.loop_count || 0);
const fileList = journal.files.map((f) => f.path);

if (loop >= MAX_LOOPS) {
  clearJournal();
  respond({
    followup_message:
      `Se alcanzo el limite de ${MAX_LOOPS} intentos automaticos y las verificaciones siguen fallando. ` +
      `Detente. No sigas editando. Resume a la persona en cinco lineas: que intentaste, que verificacion sigue en rojo, ` +
      `cual es tu mejor hipotesis, y que necesitas de ella para desbloquearlo.`,
  });
}

const { results, blockingFailures, advisoryFailures, configured } = runChecks(config);
const smells = journal.files.filter((f) => f.notes.length > 0);

if (!configured && smells.length === 0) {
  clearJournal();
  respond({});
}

if (blockingFailures.length > 0) {
  const detail = blockingFailures
    .map((f) => `### ${f.name}\ncomando: ${f.command}\n\n${f.output}`)
    .join("\n\n");

  respond({
    followup_message:
      `El turno no puede cerrarse: ${blockingFailures.length} verificacion(es) obligatorias fallan.\n\n` +
      `Archivos que tocaste:\n${fileList.map((f) => `  - ${f}`).join("\n")}\n\n` +
      `${formatReport(results)}\n\n${detail}\n\n` +
      `Arregla la causa, no el sintoma: no borres el enlace, la tarea o el criterio para que la verificacion pase. ` +
      `Si crees que la verificacion esta mal, dilo explicitamente antes de tocar nada. Intento ${loop + 1} de ${MAX_LOOPS}.`,
  });
}

const warnings = [
  ...advisoryFailures.map((f) => `  - ${f.name}: ${f.output.split("\n")[0]}`),
  ...smells.map((f) => `  - ${f.path}: ${f.notes.join(", ")}`),
];

if (warnings.length > 0) {
  clearJournal();
  respond({
    followup_message:
      `Las verificaciones obligatorias pasan, pero quedaron avisos que debes resolver antes de dar el turno por cerrado:\n\n` +
      warnings.join("\n") +
      `\n\nCorrigelos o justifica en una linea por que se quedan.`,
  });
}

if (config.versioning === "auto-git") {
  const result = snapshot(fileList.slice(0, 3).join(", ") || "cambios del agente");

  if (!result.ok && result.reason === "no-repo") {
    clearJournal();
    respond({
      followup_message:
        "Las verificaciones pasan, pero no se guardo ningun punto de restauracion: este espacio " +
        "no tiene historial y versioning esta en auto-git. Detente y dile a la persona que " +
        "corra /historial antes de seguir trabajando.",
    });
  }

  if (result.ok) console.error(`[stop-gate] punto de restauracion ${result.sha}`);
}

clearJournal();
respond({});
