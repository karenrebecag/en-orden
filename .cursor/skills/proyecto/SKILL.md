---
name: proyecto
description: Crea un proyecto nuevo con objetivo y criterio de cierre comprobable. Se usa antes de empezar cualquier cosa que tenga final y requiera varios pasos.
disable-model-invocation: true
---

# Proyecto nuevo

Un proyecto sin criterio de cierre no se puede terminar, solo abandonar. Esta skill existe para que eso no pase.

La plantilla exacta esta en `references/plantilla.md`. Leela antes de escribir.

## Proceso

1. Escucha que quiere la persona, en sus palabras.
2. Haz maximo tres preguntas, solo las que cambien el resultado. La mas importante: **"¿Como se ve esto terminado?"**
3. Convierte la respuesta en criterios que se puedan mirar:
   - Mal: "sentirme mejor con mis finanzas"
   - Bien: "el archivo areas/finanzas.md tiene los 4 gastos fijos con su monto y fecha de cobro, y existe recursos/presupuesto-2026.md con el presupuesto del mes firmado por mi"
   Si un criterio no se puede mirar, no es criterio: reescribelo con la persona hasta que lo sea.
4. Escribe el archivo en `proyectos/`, numerado: mira el numero mas alto que exista y suma uno (`03-mudanza.md`).
5. Lee el resultado en voz alta (resumen de 5 lineas) y pregunta si asi es. No sigas a `/tareas` sin un si.

## Reglas

- Fechas siempre absolutas (2026-09-15), nunca "el proximo viernes".
- Si al hablar salen cosas que no son de este proyecto, van a `entrada/`, no al proyecto.
- Un proyecto que no cabe en una pantalla esta mal partido: propon dividirlo.
