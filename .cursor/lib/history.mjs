import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./config.mjs";

// execFileSync con argumentos en array: el mensaje del commit viene de nombres
// de archivo y jamas debe pasar por un shell.
function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

export function isRepo() {
  return existsSync(join(ROOT, ".git"));
}

/**
 * Punto de restauracion automatico para quien no usa git.
 * Solo se llama cuando los checks pasaron, asi el historial no guarda estados rotos.
 */
export function snapshot(summary) {
  if (!isRepo()) return { ok: false, reason: "no-repo" };

  try {
    const status = git("status", "--porcelain").trim();
    if (!status) return { ok: false, reason: "sin-cambios" };

    git("add", "-A");
    const message = `checkpoint: ${summary}`.slice(0, 140);
    git("commit", "--no-verify", "-m", message);
    const sha = git("rev-parse", "--short", "HEAD").trim();
    return { ok: true, sha };
  } catch (err) {
    return { ok: false, reason: (err.stderr || err.message || "").trim().slice(0, 200) };
  }
}
