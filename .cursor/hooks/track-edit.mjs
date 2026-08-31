import { basename, relative } from "node:path";
import { ROOT, loadConfig, readInput, respond } from "../lib/config.mjs";
import { recordEdit } from "../lib/journal.mjs";

// afterFileEdit no bloquea nada a proposito: los avisos se acumulan en el
// journal y se cobran de golpe en stop-gate, cuando el turno ya termino.
const SMELLS = [
  { note: "casilla malformada", pattern: /^\s*[-*]\s*\[(?!( |x)\])[^\]]*\]/m },
  {
    note: "posible dato sensible en claro",
    // "clave" con guarda: "palabras clave: growth" es vocabulario de marketing, no un secreto.
    pattern: /(contrase[nñ]a|password|(?<!palabras?\s)clave|api[_-]?key|secret|token|pin|nip)\s*[:=]\s*\S{4,}/i,
  },
];

const input = await readInput();
const config = loadConfig();
const filePath = input.file_path;

if (!filePath) respond({});

const added = (input.edits || []).map((e) => e.new_string || "").join("\n");
const notes = SMELLS.filter((s) => s.pattern.test(added)).map((s) => s.note);

// Un .md nuevo en la raiz casi siempre es un archivo que debia ir a una carpeta.
const rel = relative(ROOT, filePath);
const ALLOWED_ROOT = new Set(["README.md", "SETUP.md", "AGENTS.md", "CLAUDE.md"]);
if (rel.endsWith(".md") && !rel.includes("/") && !ALLOWED_ROOT.has(rel)) {
  notes.push("archivo suelto en la raiz: muevelo a entrada/, proyectos/, areas/ o recursos/");
}

if (config.protectedFiles.some((p) => rel === p || basename(filePath) === basename(p))) {
  notes.push("archivo protegido editado");
}

recordEdit(filePath, notes);
respond({});
