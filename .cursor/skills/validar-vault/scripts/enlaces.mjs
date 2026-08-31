import { existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { CARPETAS, mdFiles, alcance, acotar, read, rel, report } from "./_util.mjs";

// Un [[enlace]] roto es conocimiento perdido en silencio: la nota existe pero
// nadie llega a ella. Blocking porque el agente que renombra o mueve un archivo
// es el mismo que puede arreglar los enlaces en el mismo turno.
//
// El indice se construye SIEMPRE con el vault completo (incluido state/, que
// enlaza a los proyectos activos): para saber si [[algo]] existe hace falta
// verlo todo. Lo que el alcance acota es de que archivos se reportan errores.

const DIRS = [...CARPETAS, "state"];
const files = mdFiles(DIRS);
const index = new Set(files.map((f) => basename(f, ".md").toLowerCase()));
const errors = [];

for (const file of acotar(files, alcance())) {
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

// El caso mas comun no es un error de dedo: es nombrar un archivo futuro al
// escribir un criterio de cierre. La salida correcta no es obvia, asi que se dice.
if (errors.some((e) => e.includes("[["))) {
  console.log(
    "pista: si el archivo aun no existe, escribelo sin corchetes (por ejemplo `recursos/nombre.md`) y conviertelo en [[enlace]] cuando lo crees. No borres la mencion.\n"
  );
}

report(errors, `enlaces: ok (${files.length} archivos revisados)`);
