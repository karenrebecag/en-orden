---
name: cerrar
description: Cierra un proyecto cuyo criterio de cierre se cumple y lo mueve a archivo/.
disable-model-invocation: true
---

# Cerrar un proyecto

Un proyecto no se cierra porque las tareas esten marcadas. Se cierra cuando el **criterio de cierre** se cumple y hay evidencia.

## Puerta

Antes de mover nada, contrasta cada linea del criterio de cierre con la realidad del espacio. Si alguna no se cumple, no cierres: di cual falta y detente. Si la persona insiste en cerrar con criterios sin cumplir, que lo diga explicitamente; entonces anotas en el proyecto "cerrado incompleto por decision de <fecha>: <que quedo fuera>" y procedes.

## Al cerrar

1. Cambia `Estado: activo` por `Estado: cerrado (<YYYY-MM-DD>)`.
2. Agrega al final una seccion `## Cierre` con dos o tres lineas: que se logro y donde quedo la evidencia.
3. Mueve el archivo a `archivo/` conservando el nombre.
4. Corre la skill `validar-vault`: mover un archivo puede romper `[[enlaces]]`; si algo se rompio, arreglalo en este mismo turno.
5. Actualiza `state/workflow_state.md`: quitalo de activos, una linea en Decisiones si el cierre cambio algo de aqui en adelante.

## Salida

```
Cerrado:    <proyecto>
Criterios:  <N de N cumplidos>
Evidencia:  <donde mirar>
Quedo en:   archivo/<nombre>.md
```

Y detente.
