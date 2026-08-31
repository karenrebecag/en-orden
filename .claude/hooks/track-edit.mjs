import { basename, relative, isAbsolute, resolve } from "node:path";
import { ROOT, loadConfig, readInput } from "../../.cursor/lib/config.mjs";
import { recordEdit } from "../../.cursor/lib/journal.mjs";

// Adaptador de Claude Code (PostToolUse sobre Edit|Write|MultiEdit).
// No bloquea nada: los avisos se acumulan en el journal y se cobran de golpe
// en el gate, cuando el turno ya termino.
//
// La documentacion solo garantiza `tool_input.file_path`; el contenido nuevo
// cambia de forma segun la tool, asi que se recoge lo que haya sin asumir.

const SMELLS = [
  { note: "casilla malformada", pattern: /^\s*[-*]\s*\[(?!( |x)\])[^\]]*\]/m },
  {
    // "clave" con guarda: "palabras clave: growth" es vocabulario de trabajo.
    note: "posible dato sensible en claro",
    pattern:
      /(contrase[nñ]a|password|(?<!palabras?\s)clave|api[_-]?key|secret|token|pin|nip)\s*[:=]\s*\S{4,}/i,
  },
];

const input = await readInput();
const config = loadConfig();
const filePath = input.tool_input?.file_path;

if (!filePath) process.exit(0);

const ti = input.tool_input || {};
const added = [
  ti.content,
  ti.new_string,
  ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e?.new_string) : []),
]
  .filter(Boolean)
  .join("\n");

const notes = SMELLS.filter((s) => s.pattern.test(added)).map((s) => s.note);

const abs = isAbsolute(filePath) ? filePath : resolve(ROOT, filePath);
const rel = relative(ROOT, abs);

// Un .md nuevo en la raiz casi siempre es un archivo que debia ir a una carpeta.
const ALLOWED_ROOT = new Set(["README.md", "SETUP.md", "AGENTS.md", "CLAUDE.md"]);
if (rel.endsWith(".md") && !rel.includes("/") && !ALLOWED_ROOT.has(rel)) {
  notes.push("archivo suelto en la raiz: muevelo a entrada/, proyectos/, areas/ o recursos/");
}

if (config.protectedFiles.some((p) => rel === p || basename(abs) === basename(p))) {
  notes.push("archivo protegido editado");
}

recordEdit(abs, notes);
process.exit(0);
