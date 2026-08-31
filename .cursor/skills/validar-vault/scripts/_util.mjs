import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, isAbsolute } from "node:path";

export const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
export const CARPETAS = ["entrada", "proyectos", "areas", "recursos", "archivo"];

// Un archivo que no se puede leer no puede tumbar la validacion entera: la
// sincronizacion de iCloud o Drive deja marcadores y copias en conflicto que
// existen para readdir y fallan al abrirse. Se omiten y se acumulan aqui para
// que estructura los reporte; omitirlos en silencio seria peor.
let omitidos = [];

/** Rutas que no se pudieron leer. Se acumulan entre llamadas y no se repiten. */
export function ilegibles() {
  return [...new Set(omitidos)];
}

function walk(dir, out) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    omitidos.push(relative(ROOT, dir) || dir);
    return out;
  }
  for (const name of names) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      omitidos.push(relative(ROOT, full) || full);
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

/** Todos los .md del vault (o de las carpetas indicadas), rutas absolutas. */
export function mdFiles(dirs = CARPETAS) {
  const out = [];
  for (const dir of dirs) {
    const full = join(ROOT, dir);
    if (existsSync(full)) walk(full, out);
  }
  return out;
}

/**
 * Archivos que este turno debe revisar, pasados como argumentos.
 * Sin argumentos devuelve null: el validador revisa el vault entero, que es
 * como lo usan /semana y validar-vault. Con argumentos, el stop-gate acota la
 * revision a lo que el turno toco, para que la deuda vieja de otro archivo no
 * bloquee un trabajo que no la causo.
 */
export function alcance() {
  const args = process.argv.slice(2).filter((a) => a && !a.startsWith("-"));
  if (args.length === 0) return null;
  const set = new Set();
  for (const arg of args) {
    if (!arg.endsWith(".md")) continue;
    const abs = isAbsolute(arg) ? resolve(arg) : resolve(ROOT, arg);
    if (existsSync(abs)) set.add(abs);
  }
  return set;
}

/** Filtra una lista de archivos por el alcance del turno (null = sin filtrar). */
export function acotar(files, scope) {
  return scope ? files.filter((f) => scope.has(f)) : files;
}

export function rel(path) {
  return relative(ROOT, path);
}

export function read(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    omitidos.push(relative(ROOT, path) || path);
    return "";
  }
}

/**
 * Contrato de salida de todos los validadores: exit 0 en verde, exit 1 con
 * una linea por problema. stop-gate solo mira el codigo de salida y la salida.
 */
export function report(errors, okMessage) {
  if (errors.length === 0) {
    console.log(okMessage);
    process.exit(0);
  }
  for (const e of errors) console.log(e);
  console.log(`\n${errors.length} problema(s).`);
  process.exit(1);
}
