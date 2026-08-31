import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { ROOT } from "./config.mjs";

// Un aviso que sale en cada turno deja de leerse a los dos dias, y con el se
// vuelven invisibles todos los demas. Se muestra una vez y se calla un dia:
// si el desorden sigue ahi manana, vuelve a salir. No hay forma de silenciarlo
// para siempre, que es justo lo que lo mantiene util.
const ARCHIVO = join(ROOT, "state", "avisos.json");
const SILENCIO_HORAS = 24;

function leer() {
  if (!existsSync(ARCHIVO)) return {};
  try {
    const data = JSON.parse(readFileSync(ARCHIVO, "utf8"));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function escribir(data) {
  mkdirSync(dirname(ARCHIVO), { recursive: true });
  writeFileSync(ARCHIVO, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Avisos que no se han mostrado en las ultimas SILENCIO_HORAS. */
export function filtrarNuevos(avisos) {
  const vistos = leer();
  const limite = Date.now() - SILENCIO_HORAS * 60 * 60 * 1000;
  return avisos.filter((a) => {
    const cuando = Date.parse(vistos[a] || "");
    return Number.isNaN(cuando) || cuando < limite;
  });
}

export function registrarMostrados(avisos) {
  const vistos = leer();
  const ahora = new Date().toISOString();
  const limite = Date.now() - SILENCIO_HORAS * 60 * 60 * 1000;

  // Se olvidan los que ya caducaron: el archivo no crece sin fin.
  const vigentes = {};
  for (const [texto, fecha] of Object.entries(vistos)) {
    if (Date.parse(fecha) >= limite) vigentes[texto] = fecha;
  }
  for (const a of avisos) vigentes[a] = ahora;

  escribir(vigentes);
}
