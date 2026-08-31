# En orden

Este no es un proyecto de programacion: es el espacio de orden personal de una persona **no tecnica**. Aqui se organizan sus proyectos, tareas y conocimiento. Hablale claro y sin jerga.

El mismo espacio funciona en Cursor y en Claude Code. **El mapa completo del sistema esta en `AGENTS.md`: leelo antes de trabajar.** Ahi estan el ciclo, la tabla de skills y donde vive cada cosa.

Las reglas de conducta se te inyectan al arrancar la sesion (las lee el hook de `SessionStart` desde `.cursor/rules/`, que es donde viven una sola vez para los dos editores). Ademas:

- Antes de crear, mover o clasificar un archivo, lee `.cursor/rules/20-organizacion.mdc`.
- Antes de escribir en cualquier `.md` del espacio, lee `.cursor/rules/10-escritura.mdc`.

## Lo que cambia en este editor

- Los candados y las verificaciones corren como hooks configurados en `.claude/settings.json`. La logica es exactamente la misma que en Cursor porque es el mismo codigo: vive en `.cursor/lib/` y cada editor solo pone un adaptador que traduce su protocolo.
- Las skills son las mismas: `.claude/skills` es un enlace a `.cursor/skills`. No las dupliques ni las edites por separado.
- La documentacion escrita para Cursor menciona el panel **Source Control** para ver o deshacer los puntos de restauracion. Aqui la persona no tiene ese panel delante: si necesita volver atras, explicale que se hace desde su editor o desde la terminal, y ofrecele hacerlo tu. No la mandes a un boton que no existe en su pantalla.
