---
name: validar-vault
description: Corre las verificaciones del espacio (enlaces rotos, formato de tareas, criterios de cierre, estructura) y devuelve un resultado por script. Usala despues de editar notas, antes de cerrar un proyecto, o cuando la persona pregunte si todo esta en orden.
---

# Validar el espacio

Cinco scripts, cada uno imprime una linea por problema y sale con codigo 1 si hay alguno. El hook `stop` corre los obligatorios al cerrar cada turno; correrlos antes te ahorra la vuelta.

```bash
node .cursor/skills/validar-vault/scripts/enlaces.mjs
node .cursor/skills/validar-vault/scripts/tareas.mjs
node .cursor/skills/validar-vault/scripts/proyectos.mjs
node .cursor/skills/validar-vault/scripts/estructura.mjs
node .cursor/skills/validar-vault/scripts/criterios.mjs
```

| Script | Que revisa | Al cerrar el turno |
|---|---|---|
| `enlaces` | ningun `[[enlace]]` ni link relativo roto | obligatorio |
| `tareas` | casillas con formato valido; tarea hecha lleva fecha | obligatorio |
| `proyectos` | todo proyecto tiene criterio de cierre no vacio | obligatorio |
| `estructura` | nada suelto en la raiz, fechas relativas, notas huerfanas, archivos ilegibles | aviso |
| `criterios` | criterios de cierre que no se pueden mirar | aviso |

## Alcance

Los obligatorios aceptan rutas como argumento y entonces revisan solo esos archivos. Asi los corre el hook `stop`: un enlace roto en un archivo que este turno no toco no puede detener un trabajo que no lo causo.

Sin argumentos revisan el espacio entero, que es como se corren aqui y en `/semana`. **La deuda vieja se junta hasta que alguien barre completo**, y ese barrido es la revision semanal: si nadie corre `/semana`, nadie la ve.

## Reglas

- Arregla la causa, no el sintoma. Nunca borres el enlace, la tarea o el criterio para que la verificacion pase.
- Si crees que una verificacion esta mal, dilo antes de tocar nada.
- Los comandos exactos viven en `project.config.json`. No los inventes.
