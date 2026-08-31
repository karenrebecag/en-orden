import { basename } from "node:path";
import { mdFiles, read, rel, report } from "./_util.mjs";

// El criterio de cierre es la promesa del sistema: sin el, un proyecto no se
// termina, se abandona. proyectos.mjs comprueba que la seccion exista; este
// mira si lo escrito ahi se puede MIRAR.
//
// No entiende el texto y no lo pretende: marca solo lo evidente, un deseo sin
// una sola senal observable. Es advisory a proposito — un falso positivo no
// puede tener derecho a bloquear el trabajo de nadie, y la ultima palabra
// sobre si un criterio sirve es de la persona.

const SIN_ACENTOS = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Senales de que algo se puede comprobar: una ruta, un numero, una fecha, o un
// verbo de existencia. Con una sola de estas, el criterio se deja pasar.
const OBSERVABLE =
  /(\.md\b|\/|\d|\bexiste\b|\bexisten\b|\bhay\b|\btiene\b|\btienen\b|\bquedo\b|\bquedaron\b|\baparece\b|\banotad|\bregistrad|\bpublicad|\benviad|\bprogramad|\bfirmad|\bescrit|\bagendad|\bcontestad|\bse puede (ver|mirar|abrir|entrar)\b)/;

// Deseos: sentimientos y estados sin forma. Solo cuentan si no hay nada observable.
const DESEO =
  /(\bguste\b|\bgusten\b|\bsentir\b|\bsienta\b|\bsentirme\b|\bparezca\b|\beste list|\besten list|\beste bien\b|\beste ordenad|\bvamos ordenad|\bmas ordenad|\btranquil|\bcomod|\bbonit|\bmejor\b|\bmejore\b|\bclaro\b|\bfacil\b|\bfluid|\bprofesional\b)/;

const errors = [];

for (const file of mdFiles(["proyectos"])) {
  if (basename(file) === "README.md") continue;
  const lines = read(file).split("\n");

  let dentro = false;
  lines.forEach((rawLine, i) => {
    if (/^##+\s/.test(rawLine)) {
      dentro = /^##\s+criterio de cierre\s*$/.test(SIN_ACENTOS(rawLine).trim());
      return;
    }
    if (!dentro) return;
    if (!/^\s*[-*]\s+\S/.test(rawLine)) return;

    const linea = SIN_ACENTOS(rawLine);
    if (OBSERVABLE.test(linea)) return;
    if (!DESEO.test(linea)) return;

    errors.push(
      `${rel(file)}:${i + 1} criterio que no se puede mirar: ${rawLine.trim().slice(0, 60)} — reescribelo como algo que existe o no existe`
    );
  });
}

if (errors.length > 0) {
  console.log(
    "un criterio sirve si otra persona puede decir si se cumple sin preguntarte. " +
      'Mal: "que al equipo le guste". Bien: "los tres correos estan en recursos/ con la palabra aprobado escrita por mi".\n'
  );
}

report(errors, "criterios: ok");
