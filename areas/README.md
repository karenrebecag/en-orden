# Areas

Lo permanente, sin fecha de fin: salud, casa, finanzas, trabajo, relaciones. Un archivo por area.

Un area tiene tareas sueltas (`- [ ]`) y notas de mantenimiento. Cuando algo de un area crece hasta necesitar varios pasos y un final, se convierte en proyecto con `/proyecto`.

## Fechas: la unica regla que importa

`/hoy` encuentra lo que vence leyendo estas carpetas. Solo puede encontrar fechas absolutas: `2026-09-03`, nunca "el jueves" ni "la proxima semana". Si dictas una fecha relativa, el agente la convierte al escribirla.

Lo que se repite (una junta semanal, un pago mensual) se anota con su **proxima** fecha y una nota de cada cuanto; al pasar, se re-fecha a la siguiente.

Ejemplo de un area de trabajo:

```markdown
# Trabajo

## Reuniones

- 2026-09-03 10:00 — Junta con direccion. Llevar status del mes. (cada jueves)

## Recordatorios

- 2026-09-15 — Vence la suscripcion de la herramienta X. Avisar una semana antes.

## Bloques de tiempo

- Lunes y miercoles 9-11: trabajo de fondo, sin juntas encima.
```
