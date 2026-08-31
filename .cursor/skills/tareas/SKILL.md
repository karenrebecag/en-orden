---
name: tareas
description: Parte un proyecto aprobado en tareas de una sesion cada una.
disable-model-invocation: true
---

# Partir en tareas

Con el proyecto aprobado, la seccion `## Tareas` se llena de pasos que una persona puede hacer de una sentada.

## Reglas de particion

- **Una tarea = una sesion.** Si necesita varias tardes, son varias tareas.
- **Empieza con verbo:** "llamar al banco", "juntar los tres presupuestos", "vaciar el closet chico".
- **En orden de dependencia:** lo que desbloquea a lo demas va primero.
- **Cada tarea acerca a un criterio de cierre.** Si una tarea no empuja ningun criterio, o sobra la tarea o falta un criterio: preguntalo.
- Entre 3 y 10 tareas. Menos de 3: quiza no era proyecto, era una tarea de un area. Mas de 10: el proyecto esta mal partido, dilo.

## Formato

```markdown
## Tareas

- [ ] juntar los tres presupuestos de la mudanza
- [ ] elegir empresa y apartar fecha
- [ ] vaciar y etiquetar cajas del cuarto chico
```

Sin fechas en las pendientes (la fecha se pone al completar). Si una tarea tiene fecha limite real, va en el texto: `- [ ] pagar el deposito (antes del 2026-09-15)`.

## Salida

Muestra la lista, pregunta si asi es, y detente. La primera tarea se trabaja con `/avanzar`, no ahora.
