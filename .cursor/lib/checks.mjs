import { execSync } from "node:child_process";
import { ROOT } from "./config.mjs";

function truncate(text, max) {
  const clean = (text || "").trim();
  if (clean.length <= max) return clean;
  // Se conserva la cola: los validadores imprimen el resumen al final.
  return "[...salida recortada...]\n" + clean.slice(-max);
}

function runOne(name, command, maxOutputChars, timeoutMs) {
  const started = Date.now();
  try {
    const output = execSync(command, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: timeoutMs,
    });
    return { name, command, ok: true, ms: Date.now() - started, output: truncate(output, 400) };
  } catch (err) {
    const output = `${err.stdout || ""}\n${err.stderr || ""}`;
    return {
      name,
      command,
      ok: false,
      ms: Date.now() - started,
      output: truncate(output || err.message, maxOutputChars),
    };
  }
}

/**
 * Ejecuta los checks configurados dentro de un presupuesto global de tiempo.
 * El hook stop tiene su propio timeout: si esto lo excede, Cursor lo mata y
 * con failClosed la accion se bloquea sin explicacion. El presupuesto reparte
 * el tiempo para que el reporte siempre alcance a salir.
 * Un check sin comando definido se omite: la plantilla no asume nada.
 */
export function runChecks(config, { only } = {}) {
  const { blocking = [], advisory = [], maxOutputChars = 2000, timeBudgetMs = 120000 } =
    config.checks;
  const wanted = only ? [only] : [...blocking, ...advisory];
  const deadline = Date.now() + timeBudgetMs;

  const results = [];
  for (const name of wanted) {
    const command = (config.commands || {})[name];
    if (!command || !command.trim()) {
      results.push({ name, command: null, ok: true, skipped: true, output: "" });
      continue;
    }
    const remaining = deadline - Date.now();
    const isBlocking = blocking.includes(name);
    if (remaining <= 0) {
      // Sin verificar no es lo mismo que en verde: un blocking sin tiempo cuenta como fallo.
      results.push({
        name,
        command,
        ok: !isBlocking,
        blocking: isBlocking,
        ms: 0,
        output: "sin verificar: se agoto el presupuesto de tiempo de los checks",
      });
      continue;
    }
    const result = runOne(name, command, maxOutputChars, remaining);
    result.blocking = isBlocking;
    results.push(result);
  }

  const failed = results.filter((r) => !r.ok);
  return {
    results,
    failed,
    blockingFailures: failed.filter((r) => r.blocking),
    advisoryFailures: failed.filter((r) => !r.blocking),
    configured: results.some((r) => !r.skipped),
  };
}

export function formatReport(results) {
  return results
    .map((r) => {
      if (r.skipped) return `  ~ ${r.name}: sin comando configurado`;
      const mark = r.ok ? "ok" : "FALLO";
      return `  ${mark} ${r.name} (${r.ms}ms)`;
    })
    .join("\n");
}
