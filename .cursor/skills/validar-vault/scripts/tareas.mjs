import { basename } from "node:path";
import { mdFiles, alcance, acotar, read, rel, report } from "./_util.mjs";

// Las tareas viven en proyectos/ y areas/. Dos invariantes:
// 1. Toda casilla tiene formato valido: "- [ ]" o "- [x]".
// 2. Toda tarea marcada hecha lleva fecha (YYYY-MM-DD): sin fecha no hay
//    forma de reconstruir despues que paso y cuando.

const VALID = /^\s*[-*]\s\[( |x)\]\s+\S/;
const ANY_BOX = /^\s*[-*]\s*\[[^\]]{0,4}\]/;
const DONE = /^\s*[-*]\s\[x\]/;
const DATE = /\d{4}-\d{2}-\d{2}/;

const errors = [];

for (const file of acotar(mdFiles(["proyectos", "areas"]), alcance())) {
  if (basename(file) === "README.md") continue;
  read(file)
    .split("\n")
    .forEach((line, i) => {
      if (!ANY_BOX.test(line)) return;
      if (!VALID.test(line)) {
        errors.push(`${rel(file)}:${i + 1} casilla malformada (usa "- [ ]" o "- [x]"): ${line.trim().slice(0, 60)}`);
        return;
      }
      if (DONE.test(line) && !DATE.test(line)) {
        errors.push(`${rel(file)}:${i + 1} tarea hecha sin fecha (agrega YYYY-MM-DD): ${line.trim().slice(0, 60)}`);
      }
    });
}

report(errors, "tareas: ok");
