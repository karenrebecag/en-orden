import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { ROOT } from "./config.mjs";

const JOURNAL = join(ROOT, "state", "changed-files.json");

// El journal sustituye a `git diff` para quien no usa control de versiones:
// es la unica fuente que sabe que toco el agente en este turno.
function empty() {
  return { updatedAt: null, files: [] };
}

export function readJournal() {
  if (!existsSync(JOURNAL)) return empty();
  try {
    const data = JSON.parse(readFileSync(JOURNAL, "utf8"));
    return { updatedAt: data.updatedAt ?? null, files: Array.isArray(data.files) ? data.files : [] };
  } catch {
    return empty();
  }
}

function write(data) {
  mkdirSync(dirname(JOURNAL), { recursive: true });
  writeFileSync(JOURNAL, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function recordEdit(absolutePath, notes = []) {
  const path = relative(ROOT, absolutePath) || absolutePath;
  const data = readJournal();
  const existing = data.files.find((f) => f.path === path);

  if (existing) {
    existing.edits += 1;
    existing.notes = [...new Set([...existing.notes, ...notes])];
  } else {
    data.files.push({ path, edits: 1, notes });
  }

  data.updatedAt = new Date().toISOString();
  write(data);
  return data;
}

export function clearJournal() {
  write(empty());
}
