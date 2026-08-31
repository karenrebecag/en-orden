import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// CURSOR_PROJECT_DIR es la unica raiz fiable: los hooks de proyecto se ejecutan
// desde la raiz, pero un script invocado a mano puede correr desde cualquier cwd.
export const ROOT = process.env.CURSOR_PROJECT_DIR || process.cwd();

const DEFAULTS = {
  vault: {
    nombre: "",
    carpetas: ["entrada", "proyectos", "areas", "recursos", "archivo"],
  },
  commands: {},
  checks: { blocking: [], advisory: [], maxOutputChars: 2000, timeBudgetMs: 120000 },
  versioning: "journal",
  guard: { enabled: true, rules: [] },
  protectedFiles: [],
  entrada: { maxItems: 15 },
};

export function loadConfig() {
  const path = join(ROOT, "project.config.json");
  if (!existsSync(path)) return { ...DEFAULTS, _missing: true };
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return {
      ...DEFAULTS,
      ...raw,
      vault: { ...DEFAULTS.vault, ...(raw.vault || {}) },
      checks: { ...DEFAULTS.checks, ...(raw.checks || {}) },
      guard: { ...DEFAULTS.guard, ...(raw.guard || {}) },
      entrada: { ...DEFAULTS.entrada, ...(raw.entrada || {}) },
    };
  } catch (err) {
    return { ...DEFAULTS, _error: err.message };
  }
}

export async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function respond(payload) {
  if (payload && Object.keys(payload).length > 0) {
    process.stdout.write(JSON.stringify(payload));
  }
  process.exit(0);
}
