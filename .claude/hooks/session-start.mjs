import { readInput } from "../../.cursor/lib/config.mjs";
import { contextoDeArranque } from "../../.cursor/lib/gate.mjs";
import { isRepo } from "../../.cursor/lib/history.mjs";

// Adaptador de Claude Code (SessionStart). Inyecta el estado del trabajo para
// que el agente no empiece preguntando lo que ya esta escrito.
//
// Diferencia de protocolo: aqui el contexto se escribe como texto plano en
// stdout, no como JSON. Y ademas se inyectan las reglas del espacio: viven en
// .cursor/rules/ con frontmatter que solo Cursor entiende, asi que este editor
// no las cargaria solo. Se leen de ahi en vez de copiarlas a otro archivo que
// envejeceria por separado.

await readInput();
const { lines, config } = contextoDeArranque({ incluirReglas: true });

// Un auto-git configurado pero sin repo falla en silencio, que es el peor de
// los estados: la persona cree que tiene puntos de restauracion y no los tiene.
if (config.versioning === "auto-git" && !isRepo()) {
  lines.push(
    "CRITICO: versioning esta en auto-git pero este espacio no tiene historial. " +
      "No se estan guardando puntos de restauracion. Antes de editar cualquier cosa, " +
      "dile a la persona que corra /historial."
  );
} else if (config.versioning !== "auto-git") {
  lines.push(
    "Este espacio no tiene puntos de restauracion automaticos. " +
      "Antes de un cambio amplio, avisa a la persona que no habra forma de deshacerlo entre sesiones."
  );
}

if (lines.length > 0) process.stdout.write(lines.join("\n\n"));
process.exit(0);
