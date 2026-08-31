import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();
export const CARPETAS = ["entrada", "proyectos", "areas", "recursos", "archivo"];

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const st = statSync(full);
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

export function rel(path) {
  return relative(ROOT, path);
}

export function read(path) {
  return readFileSync(path, "utf8");
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
