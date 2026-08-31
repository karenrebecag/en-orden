# Areas

Lo permanente, sin fecha de fin: salud, casa, finanzas, trabajo, relaciones. Un archivo por area.

Un area tiene tareas sueltas (`- [ ]`) y notas de mantenimiento. Cuando algo de un area crece hasta necesitar varios pasos y un final, se convierte en proyecto con `/proyecto`.

## Fechas: la unica regla que importa

`/hoy` encuentra lo que vence leyendo estas carpetas. Solo puede encontrar fechas absolutas: `2026-09-03`, nunca "el jueves" ni "la proxima semana". Si dictas una fecha relativa, el agente la convierte al escribirla.

Lo que se repite (una junta semanal, un pago mensual) se anota con su **proxima** fecha y una nota de cada cuanto; al pasar, se re-fecha a la siguiente.

## Reunion o recordatorio

La diferencia importa porque se completan distinto:

- Una **reunion** pasa a una hora. No se "termina": llega su fecha y ocurre. Va como linea suelta, y `/semana` la re-fecha si es recurrente.
- Un **recordatorio** es algo que tienes que hacer antes de una fecha. Eso es una tarea, y va **con casilla**, para que al hacerlo lleve su fecha y quede el rastro: `- [x] 2026-09-15 - renovar la suscripcion (2026-09-14)`.

Un recordatorio sin casilla no lo revisa nadie: las verificaciones solo miran casillas. Si lo escribes como linea suelta, el dia que lo hagas no habra donde marcarlo y solo quedara borrarlo, que es perder la historia.

Ejemplo de un area de trabajo:

```markdown
# Trabajo

## Reuniones

- 2026-09-03 10:00 — Junta con direccion. Llevar status del mes. (cada primer jueves)

## Recordatorios

- [ ] 2026-09-15 - renovar la suscripcion de la herramienta X, avisar a pagos una semana antes
- [x] 2026-08-10 - mandar la factura de julio (2026-08-31)

## Bloques de tiempo

- Lunes y miercoles 9-11: trabajo de fondo, sin juntas encima.
```
