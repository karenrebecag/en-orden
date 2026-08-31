import { loadConfig, readInput, respond } from "../lib/config.mjs";
import { readJournal, clearJournal } from "../lib/journal.mjs";
import { runChecks, formatReport } from "../lib/checks.mjs";
import { snapshot, borradosGrandes } from "../lib/history.mjs";
import { filtrarNuevos, registrarMostrados } from "../lib/avisos.mjs";

// Este hook es el que cierra el ciclo. `followup_message` reinyecta al agente
// automaticamente, asi que un turno no puede terminar con el espacio roto.
// MAX_LOOPS debe ser menor que loop_limit en hooks.json: el mensaje de
// rendicion se emite en el intento MAX_LOOPS y necesita un loop libre para llegar.
const MAX_LOOPS = 3;
const MAX_LINEAS_AVISO = 10;

const input = await readInput();
const config = loadConfig();

if (input.status !== "completed") respond({});

const journal = readJournal();
if (journal.files.length === 0) respond({});

const loop = Number(input.loop_count || 0);
const fileList = journal.files.map((f) => f.path);

if (loop >= MAX_LOOPS) {
  // Rendirse sin guardar nada dejaba el trabajo del turno sin punto de
  // restauracion justo en el turno que salio mal. Se guarda marcado, para que
  // en el panel se distinga de un punto con todo en verde.
  if (config.versioning === "auto-git") {
    snapshot(`SIN VERIFICAR - ${fileList.slice(0, 3).join(", ") || "cambios del agente"}`);
  }
  clearJournal();
  respond({
    followup_message:
      `Se alcanzo el limite de ${MAX_LOOPS} intentos automaticos y las verificaciones siguen fallando. ` +
      `Detente. No sigas editando. Se guardo un punto de restauracion marcado como SIN VERIFICAR para no perder el trabajo. ` +
      `Resume a la persona en cinco lineas: que intentaste, que verificacion sigue en rojo, ` +
      `cual es tu mejor hipotesis, y que necesitas de ella para desbloquearlo.`,
  });
}

const { results, blockingFailures, advisoryFailures, configured } = runChecks(config, {
  files: fileList,
});
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
      `El turno no puede cerrarse: ${blockingFailures.length} verificacion(es) obligatorias fallan ` +
      `en los archivos que tocaste.\n\n` +
      `Archivos que tocaste:\n${fileList.map((f) => `  - ${f}`).join("\n")}\n\n` +
      `${formatReport(results)}\n\n${detail}\n\n` +
      `Arregla la causa, no el sintoma: no borres el enlace, la tarea o el criterio para que la verificacion pase. ` +
      `Si crees que la verificacion esta mal, dilo explicitamente antes de tocar nada. Intento ${loop + 1} de ${MAX_LOOPS}.`,
  });
}

// Los avisos se mostraban recortados a su primera linea, asi que un validador
// con tres hallazgos entregaba uno y el resto desaparecia. Ahora salen todos,
// sin el marcador de recorte ni la linea de resumen, que no dicen nada.
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

const avisos = [
  ...advisoryFailures.flatMap(lineasDeAviso),
  ...smells.map((f) => `  - ${f.path}: ${f.notes.join(", ")}`),
  ...borradosGrandes(fileList).map(
    (b) => `  - ${b.path}: se borraron ${b.borradas} lineas y se agregaron ${b.agregadas}. Si fue a proposito, dilo en una linea; si no, se recupera desde el panel Source Control`
  ),
];

// Un aviso repetido en cada turno deja de leerse y entrena a ignorarlos todos.
// Se muestra una vez y se calla un dia; si sigue ahi manana, vuelve a salir.
const nuevos = filtrarNuevos(avisos);

if (nuevos.length > 0) {
  registrarMostrados(nuevos);
  clearJournal();
  respond({
    followup_message:
      `Las verificaciones obligatorias pasan. Quedan avisos que no detienen el trabajo, ` +
      `pero conviene resolver antes de dar el turno por cerrado:\n\n` +
      nuevos.join("\n") +
      `\n\nCorrigelos o justifica en una linea por que se quedan. No volveran a salir hoy.`,
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
