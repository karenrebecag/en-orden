import { basename } from "node:path";
import { mdFiles, read, rel, report } from "./_util.mjs";

// Un proyecto sin criterio de cierre no se puede terminar, solo abandonar.
// Blocking: es la seccion que /cerrar contrasta y la que separa esta plantilla
// de una lista de deseos.

const errors = [];

for (const file of mdFiles(["proyectos"])) {
  if (basename(file) === "README.md") continue;
  const text = read(file);

  const match = text.match(/^##\s+Criterio de cierre\s*$([\s\S]*?)(?=^##\s|\n*$(?![\s\S]))/im);
  const body = match ? match[1].replace(/<!--[\s\S]*?-->/g, "").trim() : "";

  if (!match) {
    errors.push(`${rel(file)} no tiene la seccion "## Criterio de cierre"`);
  } else if (!body) {
    errors.push(`${rel(file)} tiene "## Criterio de cierre" vacio: escribe como se ve terminado, en cosas que se puedan mirar`);
  }
}

report(errors, "proyectos: ok");
