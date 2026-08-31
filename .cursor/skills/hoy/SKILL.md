---
name: hoy
description: Arranque del dia. Lee el estado, revisa fechas y proyectos activos, y propone las tres cosas del dia.
disable-model-invocation: true
---

# Hoy

Decides que toca hoy leyendo lo que ya esta escrito, no preguntandoselo a la persona.

## Proceso

1. Lee `state/workflow_state.md`.
2. Si `entrada/` tiene elementos, lo primero que propones es `/ordenar`. Una entrada llena entierra todo lo demas.
3. Recorre `proyectos/`: tareas pendientes, fechas que vencen hoy o ya vencieron, proyectos sin avanzar en mas de una semana.
4. Revisa `areas/` solo por fechas: algo que vence, algo periodico que toca.

## Salida

Maximo tres propuestas, en orden. Por cada una: que es, de que proyecto o area viene, y por que hoy. Una linea cada una.

Si hay mas de tres candidatas, di cuales quedaron fuera en una linea, sin detalle.

Despues pregunta: "¿Con cual empezamos?" y detente. No empieces ninguna sola.

## Prohibido

- Inventar tareas que no estan escritas en ningun proyecto o area.
- Proponer mas de tres cosas. Un dia con diez prioridades no tiene ninguna.
- Editar archivos. `/hoy` solo lee.
