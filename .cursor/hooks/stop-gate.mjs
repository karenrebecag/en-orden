import { readInput, respond } from "../lib/config.mjs";
import { evaluarCierre } from "../lib/gate.mjs";

// Adaptador de Cursor (stop). La logica del cierre vive en lib/gate.mjs,
// compartida con el adaptador de Claude Code.
//
// `followup_message` reinyecta al agente automaticamente, asi que un turno no
// puede terminar con el espacio roto. MAX_LOOPS (en gate.mjs) debe ser menor
// que loop_limit en hooks.json: el mensaje de rendicion se emite en el intento
// MAX_LOOPS y necesita un loop libre para llegar.

const input = await readInput();

if (input.status !== "completed") respond({});

const resultado = evaluarCierre(Number(input.loop_count || 0));

if (resultado.accion === "nada") respond({});

respond({ followup_message: resultado.mensaje });
