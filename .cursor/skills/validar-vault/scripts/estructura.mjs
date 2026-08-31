import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { ROOT, CARPETAS, mdFiles, ilegibles, read, rel, report } from "./_util.mjs";

// Advisory: desorden que no rompe nada hoy pero se acumula. Se avisa, no se bloquea.
// Este validador revisa siempre el vault entero: ignora el alcance del turno a
// proposito, porque su trabajo es justo mirar lo que nadie esta mirando.

const errors = [];

// 1. Archivos .md sueltos en la raiz: todo contenido vive en una carpeta.
const ALLOWED_ROOT = new Set(["README.md", "SETUP.md", "AGENTS.md"]);
for (const name of readdirSync(ROOT)) {
  if (name.startsWith(".")) continue;
  if (!name.endsWith(".md")) continue;
  try {
    if (statSync(join(ROOT, name)).isDirectory()) continue;
  } catch {
    continue; // lo reporta el aviso de archivos ilegibles
  }
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

// 4. workflow_state.md creciendo hacia el recorte: el arranque de sesion solo
// inyecta 1500 caracteres, y lo que no entra se pierde en silencio. Se avisa
// antes de llegar, para que /semana lo compacte con margen.
const STATE_BUDGET = 1500;
const STATE_WARN = 1200;
const statePath = join(ROOT, "state", "workflow_state.md");
if (existsSync(statePath)) {
  const len = readFileSync(statePath, "utf8").trim().length;
  if (len > STATE_WARN) {
    errors.push(
      `state/workflow_state.md tiene ${len} caracteres y el arranque de sesion solo inyecta ${STATE_BUDGET}: compactalo con /semana antes de que se recorte`
    );
  }
}

// 5. Notas huerfanas en recursos/: sin ningun [[enlace]] saliente y sin que
// nadie las enlace, no se vuelven a encontrar. Solo recursos/ — los proyectos
// y areas se abren por el ciclo; una nota de conocimiento solo por su grafo.
const all = mdFiles();
const linkedNames = new Set();
const hasOutbound = new Map();
for (const f of all) {
  let inFence = false;
  let out = false;
  for (const rawLine of read(f).split("\n")) {
    if (/^\s*```/.test(rawLine)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    for (const m of rawLine.replace(/`[^`]*`/g, "").matchAll(/\[\[([^\]|#]+)/g)) {
      linkedNames.add(m[1].trim().toLowerCase());
      out = true;
    }
  }
  hasOutbound.set(f, out);
}
for (const f of all) {
  if (!rel(f).startsWith("recursos/") || basename(f) === "README.md") continue;
  if (!hasOutbound.get(f) && !linkedNames.has(basename(f, ".md").toLowerCase())) {
    errors.push(
      `${rel(f)} no tiene ningun [[enlace]] ni nadie la enlaza: no se va a volver a encontrar. Enlazala desde el proyecto o area que la use`
    );
  }
}

// 6. Fechas relativas escritas a mano: /hoy y /semana buscan vencimientos y
// solo encuentran fechas absolutas. "el jueves que viene" no lo encuentra nadie
// y el compromiso se pierde sin que ninguna verificacion lo note.
// Anclada al inicio del elemento: el formato documentado pone la fecha primero
// ("- 2026-09-15 - pagar el predial"), asi que una fecha relativa ahi ocupa el
// lugar de la fecha. A media frase casi siempre es lenguaje, no un compromiso:
// "correr /hoy manana y empezar" no es una cita con el plomero.
const RELATIVAS =
  /^(hoy|manana|pasado manana|anteayer|la proxima semana|la semana que viene|el proximo mes|el mes que viene|(el|este|el proximo) (lunes|martes|miercoles|jueves|viernes|sabado|domingo)( que viene)?|en \d+ (dias|semanas|meses))\b/;
const SIN_ACENTOS = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

for (const f of mdFiles(["areas", "proyectos"])) {
  if (basename(f) === "README.md") continue;
  let seccion = "";
  read(f)
    .split("\n")
    .forEach((rawLine, i) => {
      const h = rawLine.match(/^##+\s+(.*)$/);
      if (h) {
        seccion = SIN_ACENTOS(h[1]);
        return;
      }
      // Los bloques de tiempo son recurrencias, no compromisos con fecha.
      if (/bloques? de tiempo|horario|rutina/.test(seccion)) return;
      if (!/^\s*[-*]\s/.test(rawLine)) return;
      const line = SIN_ACENTOS(rawLine);
      if (/\d{4}-\d{2}-\d{2}/.test(line)) return; // ya tiene fecha absoluta
      if (/\bcada\b/.test(line)) return; // recurrencia declarada
      // Se quita la vineta y la casilla para ver con que empieza de verdad.
      const cuerpo = line.replace(/^\s*[-*]\s+(\[[ x]\]\s+)?/, "");
      if (RELATIVAS.test(cuerpo)) {
        errors.push(
          `${rel(f)}:${i + 1} fecha relativa que /hoy no puede encontrar: ${rawLine.trim().slice(0, 60)} — escribela como YYYY-MM-DD`
        );
      }
    });
}

// 7. Lo que no se pudo leer. Suele venir de iCloud o Drive, que dejan
// marcadores de descarga pendiente y copias en conflicto dentro de la carpeta.
const noLeidos = ilegibles();
if (noLeidos.length > 0) {
  errors.push(
    `hay ${noLeidos.length} archivo(s) que no se pudieron leer y quedaron fuera de la revision: ${noLeidos
      .slice(0, 3)
      .join(", ")}${noLeidos.length > 3 ? ", ..." : ""}. Suelen venir de iCloud o Drive: abre la carpeta en el Finder y borralos o descargalos`
  );
}

report(errors, "estructura: ok");
