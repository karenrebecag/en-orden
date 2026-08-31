import { existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { mdFiles, read, rel, report } from "./_util.mjs";

// Un [[enlace]] roto es conocimiento perdido en silencio: la nota existe pero
// nadie llega a ella. Blocking porque el agente que renombra o mueve un archivo
// es el mismo que puede arreglar los enlaces en el mismo turno.

const files = mdFiles();
const index = new Set(files.map((f) => basename(f, ".md").toLowerCase()));
const errors = [];

for (const file of files) {
  // El codigo inline (`asi`) y los bloques ``` son texto ilustrativo, no enlaces.
  let inFence = false;
  const lines = read(file).split("\n");
  lines.forEach((rawLine, i) => {
    if (/^\s*```/.test(rawLine)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const line = rawLine.replace(/`[^`]*`/g, "");
    // [[Nombre]], [[Nombre|alias]], [[Nombre#seccion]]
    for (const m of line.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
      const name = m[1].trim().toLowerCase();
      if (name && !index.has(name)) {
        errors.push(`${rel(file)}:${i + 1} enlace roto: [[${m[1].trim()}]]`);
      }
    }
    // [texto](ruta/relativa.md) — se ignoran http(s), mailto y anclas
    for (const m of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|#|tel:)/i.test(target)) continue;
      const clean = decodeURIComponent(target.split("#")[0]);
      if (!clean) continue;
      if (!existsSync(resolve(dirname(file), clean))) {
        errors.push(`${rel(file)}:${i + 1} enlace roto: (${target})`);
      }
    }
  });
}

report(errors, `enlaces: ok (${files.length} archivos revisados)`);
