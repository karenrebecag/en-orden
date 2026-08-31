import { readInput } from "../../.cursor/lib/config.mjs";
import { evaluarCierre, leerIntentos, guardarIntentos, MAX_LOOPS } from "../../.cursor/lib/gate.mjs";

// Adaptador de Claude Code (Stop). La logica del cierre vive en
// .cursor/lib/gate.mjs, compartida con el adaptador de Cursor.
//
// Diferencia de protocolo: Cursor entrega el numero de intento; Claude Code
// solo dice si ya bloqueo antes (`stop_hook_active`), asi que el contador lo
// llevamos en state/intentos.json y se reinicia cuando el turno cierra bien.
// Para bloquear se usa exit 2 con el mensaje en stderr, que es la via
// documentada para devolverle trabajo al modelo.

const input = await readInput();

// Sin bloqueo previo empieza cuenta nueva: es un turno distinto.
const loop = input.stop_hook_active ? leerIntentos() : 0;

let resultado;
try {
  resultado = evaluarCierre(loop);
} catch (err) {
  // Un fallo del gate no puede dejar a la persona encerrada sin explicacion.
  guardarIntentos(0);
  process.stderr.write(
    `Las verificaciones del espacio no se pudieron correr (${err.message}). ` +
      `Dile a la persona que algo esta mal en la instalacion y no sigas editando.`
  );
  process.exit(2);
}

if (resultado.accion === "bloquear") {
  guardarIntentos(loop + 1);
  process.stderr.write(resultado.mensaje);
  process.exit(2);
}

guardarIntentos(0);

if (resultado.accion === "avisar") {
  // Un aviso tambien se le devuelve al modelo, pero no reinicia la cuenta:
  // ya paso lo obligatorio, esto es lo que conviene dejar limpio.
  process.stderr.write(resultado.mensaje);
  process.exit(2);
}

process.exit(0);
