# En orden

Plantilla para ordenar tu vida con agentes de IA en Cursor, pensada para personas que no programan. Proyectos con final verificable, tareas que no se pierden, una base de conocimiento conectada, y un sistema que no deja que el agente ensucie.

Instalacion en `SETUP.md`. Mapa del sistema en `AGENTS.md`.

## El problema que resuelve

Las listas de tareas fallan siempre igual: los proyectos no terminan (solo se abandonan), las notas no se vuelven a encontrar, y cuando un asistente de IA "ayuda", nadie verifica lo que toco.

Faltan tres cosas que una app de tareas no da:

1. **Un final comprobable.** "Sentirme mejor con mis finanzas" no se puede terminar. "Los 4 gastos fijos estan anotados con monto y fecha de cobro" si.
2. **Un verificador que no es quien hizo el trabajo.** El que avanza no firma; firma otro que solo lee.
3. **Algo que obligue.** Pedirle al agente que no borre nada es una sugerencia. Un hook es un candado.

## Como funciona

Cinco carpetas y un ciclo:

```
entrada/     lo que traes en la cabeza, sin clasificar
proyectos/   lo que tiene final y varios pasos
areas/       lo permanente: salud, casa, finanzas
recursos/    la base de conocimiento, conectada con [[enlaces]]
archivo/     lo terminado, con su evidencia
```

`/hoy` propone el dia. `/ordenar` vacia la entrada. `/proyecto` obliga a definir como se ve terminado. `/avanzar` trabaja una tarea y se detiene. `/cerrar` solo archiva lo que cumple su criterio.

## La pieza que cierra el ciclo

Al terminar cada turno del agente, unos scripts revisan el espacio: ningun `[[enlace]]` roto, ninguna tarea malformada o hecha sin fecha, ningun proyecto sin criterio de cierre. **Si algo falla, la tarea se le devuelve al agente automaticamente** hasta tres veces, y despues se detiene y te explica que pasa.

Y cuando todo esta en verde, se guarda un punto de restauracion solo: cualquier cosa se puede deshacer desde el panel Source Control de Cursor, sin escribir un comando jamas.

## Lo que el agente no puede hacer

Borrar con la terminal, enviar tu contenido fuera de la computadora, mover archivos fuera de la carpeta, tocar el historial a mano, leer archivos con claves. No es un consejo: son hooks que bloquean el comando aunque venga disfrazado.

Esto detiene el descuido, no la intencion. La copia de seguridad externa sigue siendo tuya.

## Referencias

- Cursor: [Rules](https://cursor.com/docs/context/rules), [Hooks](https://cursor.com/docs/agent/hooks), [Skills](https://cursor.com/docs/skills), [Subagents](https://cursor.com/docs/agent/subagents)
- El modelo de carpetas adapta [PARA](https://fortelabs.com/blog/para/) (Tiago Forte)
- El criterio de cierre verificable viene del spec-driven development: [GitHub Spec Kit](https://github.com/github/spec-kit)
