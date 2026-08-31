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
 * Archivos del turno que perdieron muchas mas lineas de las que ganaron.
 * Vaciar un archivo hace pasar cualquier verificacion, asi que "arregla la
 * causa, no el sintoma" no puede ser solo una instruccion de texto. Esto no
 * bloquea: compactar es legitimo (/semana lo hace), pero merece una linea de
 * explicacion. Un borrado que acompana una reescritura no dispara.
 */
export function borradosGrandes(paths, { minimo = 10, maxAgregadas = 2 } = {}) {
  if (!isRepo() || !paths || paths.length === 0) return [];
  try {
    const salida = git("diff", "--numstat", "HEAD", "--", ...paths);
    return salida
      .split("\n")
      .map((linea) => linea.split("\t"))
      .filter((cols) => cols.length >= 3)
      .map(([agregadas, borradas, path]) => ({
        path,
        agregadas: Number(agregadas) || 0,
        borradas: Number(borradas) || 0,
      }))
      // Se borro mucho y no se escribio nada en su lugar. Una reescritura que
      // compacta (borra 24, deja 8) no entra: eso es trabajo, no vaciado.
      .filter((f) => f.borradas >= minimo && f.agregadas <= maxAgregadas);
  } catch {
    return [];
  }
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
