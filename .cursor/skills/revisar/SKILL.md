---
name: revisar
description: Contrasta un proyecto contra su criterio de cierre usando el agente verificador.
disable-model-invocation: true
---

# Revisar

Quien avanzo el proyecto no puede firmarlo. La revision la hace el subagente `verificador`, que es de solo lectura y no tiene ningun incentivo en que el reporte salga limpio.

## Proceso

1. Identifica que proyecto se revisa (el que diga la persona; si no dice, el ultimo con tareas marcadas).
2. Delega en el subagente `verificador` con el nombre del archivo del proyecto.
3. Presenta su reporte sin suavizarlo. Si el verificador dice que un criterio no se cumple, eso es lo que se reporta, aunque tu creas que si.

## El reporte responde tres cosas

- Por cada criterio de cierre: ¿se cumple? ¿donde esta la evidencia?
- Por cada tarea marcada hecha: ¿tiene fecha? ¿hay rastro en Notas de que paso?
- ¿Que falta para poder correr /cerrar?

## Despues

Si todo se cumple, propon `/cerrar`. Si no, lista lo que falta y detente. No arregles nada en esta skill: arreglar es `/avanzar`.
