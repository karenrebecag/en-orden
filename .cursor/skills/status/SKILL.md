---
name: status
description: Convierte lo escrito en el espacio en un reporte de avance para compartir o llevar a una junta. Solo reporta lo que tiene evidencia.
disable-model-invocation: true
---

# Status

El espacio acumula avance con fechas y evidencia; esta skill lo convierte en un reporte que otra persona puede leer. Su valor es que **no inventa**: si el dato no esta escrito, el reporte dice "sin dato", no lo estima.

## Proceso

1. Si la persona no lo dijo, pregunta las dos cosas que cambian el reporte: **¿para quien es?** (jefe, equipo, cliente, una junta) y **¿que periodo cubre?** (la semana, el mes). Nada mas.

2. Recolecta **solo lo escrito**:
   - De cada proyecto activo: tareas hechas del periodo (con su fecha), la siguiente tarea, y todo bloqueo anotado.
   - De `archivo/`: proyectos cerrados en el periodo, con su seccion de cierre.
   - De `areas/`: fechas proximas que la audiencia deba conocer.

3. Escribe `recursos/status-<YYYY-MM-DD>.md` con la fecha de hoy. Si ya existe uno de hoy, se actualiza, no se duplica.

4. Estructura del reporte, maximo una pantalla:
   - **Avanzo** — que se hizo, con fechas.
   - **Se cerro** — proyectos terminados y donde esta la evidencia.
   - **Sigue** — lo proximo, en orden.
   - **Bloqueos y riesgos** — lo que frena o puede frenar, sin suavizar.
   - **Fechas proximas** — lo que vence pronto.

5. Enlaza cada proyecto y recurso citado con `[[enlaces]]`, y lee el reporte a la persona en cinco lineas: es suyo, se ajusta hasta que diga que asi va.

## Reglas

- Nada que no este escrito en el espacio. Un numero sin fuente no entra.
- Una tarea a medias se reporta a medias. El reporte hereda la honestidad de las marcas.
- Sin casillas `- [ ]` dentro del reporte: es una foto, no una lista de trabajo.
- El tono lo pone la audiencia: a un jefe, resultados primero; al equipo, siguiente paso primero.

## Salida

```
Reporte:   recursos/status-<fecha>.md
Cubre:     <periodo> para <audiencia>
Proyectos: N activos, N cerrados en el periodo
Sin dato:  <lo que falto por no estar escrito, o "nada">
```

Y detente.
