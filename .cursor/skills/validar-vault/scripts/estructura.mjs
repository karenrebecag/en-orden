import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { ROOT, CARPETAS, report } from "./_util.mjs";

// Advisory: desorden que no rompe nada hoy pero se acumula. Se avisa, no se bloquea.

const errors = [];

// 1. Archivos .md sueltos en la raiz: todo contenido vive en una carpeta.
const ALLOWED_ROOT = new Set(["README.md", "SETUP.md", "AGENTS.md"]);
for (const name of readdirSync(ROOT)) {
  if (name.startsWith(".")) continue;
  if (!name.endsWith(".md")) continue;
  if (statSync(join(ROOT, name)).isDirectory()) continue;
  if (!ALLOWED_ROOT.has(name)) {
    errors.push(`${name} esta suelto en la raiz: muevelo a entrada/, proyectos/, areas/ o recursos/`);
  }
}

// 2. Carpetas del sistema que faltan.
for (const dir of CARPETAS) {
  if (!existsSync(join(ROOT, dir))) errors.push(`falta la carpeta ${dir}/`);
}

// 3. entrada/ desbordada: mas alla del limite, clasificar deja de ser una tarea corta.
let maxItems = 15;
try {
  const config = JSON.parse(readFileSync(join(ROOT, "project.config.json"), "utf8"));
  if (config.entrada?.maxItems) maxItems = config.entrada.maxItems;
} catch {
  // sin config se usa el limite por defecto
}

const entradaDir = join(ROOT, "entrada");
if (existsSync(entradaDir)) {
  const items = readdirSync(entradaDir).filter((f) => !f.startsWith(".") && f !== "README.md");
  if (items.length > maxItems) {
    errors.push(`entrada/ tiene ${items.length} elementos (limite ${maxItems}): toca correr /ordenar`);
  }
}

report(errors, "estructura: ok");
