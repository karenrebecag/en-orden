---
name: semana
description: Revision semanal. Re-fecha lo recurrente, nombra proyectos estancados, compacta las Decisiones y deja el estado cabiendo completo en el arranque de sesion.
disable-model-invocation: true
---

# Semana

El ciclo de cada turno lo cuida el sistema solo. Lo que nadie cuida solo es el paso de las semanas: fechas que ya pasaron, proyectos que nadie toca, un estado que crece hasta que deja de caber. Esta skill se corre una vez por semana, idealmente el mismo dia.

## Proceso

1. **Fechas vencidas.** Recorre `areas/`: toda fecha que ya paso se resuelve con la persona. Lo recurrente se re-fecha a la proxima (la junta del jueves pasado pasa al jueves que viene); lo que ya no aplica se quita; lo que quedo pendiente de verdad se vuelve tarea. Nada queda con fecha en el pasado.

2. **Proyectos estancados.** Todo proyecto sin tarea marcada en los ultimos 14 dias se nombra, uno por uno. Por cada uno la persona elige: seguir (y anotas en sus Notas que lo destrabo), partirlo en algo mas chico con `/proyecto`, o cerrarlo incompleto con `/cerrar`. Tu no eliges; tu obligas a elegir.

3. **Decisiones.** En `state/workflow_state.md`: funde las repetidas, quita con permiso las que ya no aplican, y muda las que ya son costumbre estable al area que les toca (una regla sobre correos vive en el area de trabajo, no en el estado; deja el `[[enlace]]`). El archivo completo debe quedar **por debajo de 1200 caracteres**. El limite duro es 1500 (lo que entra en cada arranque de sesion, y lo que se pase se recorta), pero apuntar a 1200 deja margen para que crezca durante la semana sin volver a chocar.

4. **entrada/.** Si tiene elementos, la revision no cierra: propone `/ordenar` primero.

5. **Cierres a la vista.** Si un proyecto tiene los criterios a punto de cumplirse, proponlo para `/revisar`. Cerrar en la revision semanal es el mejor momento: la evidencia esta fresca.

6. **Barrido completo.** Corre la skill `validar-vault` sobre el espacio entero, sin acotar a ningun archivo. Durante la semana las verificaciones solo miran lo que cada turno toca, para no detener a la persona por deuda que no causo; **este es el unico momento en que se mira todo**. Lo que salga se arregla ahora o se anota como bloqueo. Si nadie corre esta skill, esa deuda no la ve nadie.

## Reglas

- Cada mudanza o borrado se dice en una linea antes de hacerlo. Es la memoria de la persona; tu solo la ordenas.
- No abras trabajo nuevo aqui: la revision revisa. Lo que aparezca por el camino va a `entrada/`.

## Salida

```
Fechas:      N re-fechadas, N quitadas, N vueltas tarea
Estancados:  <proyecto → lo que decidio la persona>, o "ninguno"
Decisiones:  N fundidas, N mudadas a areas/, estado en N caracteres
Siguiente:   lo primero de la semana que empieza
```

Y detente.
