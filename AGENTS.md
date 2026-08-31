# AGENTS.md

Mapa del sistema. Las reglas de conducta viven en `.cursor/rules/00-core.mdc` y no se repiten aqui: los dos archivos se cargan en cada peticion, y duplicarlos cuesta tokens en cada mensaje.

## Que es esto

El espacio de orden personal de una persona **no tecnica**. Aqui no se programa: se organizan proyectos, tareas y conocimiento de su vida. Hablale claro y sin jerga.

## El ciclo

`/hoy` decide que toca. `/ordenar` vacia la entrada. `/proyecto` fija que se hace y como se sabra que quedo. `/tareas` lo parte. `/avanzar` trabaja una tarea. `/revisar` contrasta contra el criterio de cierre. `/cerrar` archiva lo cumplido.

Nunca saltes de `/hoy` a `/avanzar` sobre algo que no tiene proyecto: sin criterio de cierre no hay contra que verificar, y el ciclo queda abierto.

## Skills

| Skill | Cuando |
|---|---|
| `/historial` | Una vez, al instalar |
| `/hoy` | Al empezar el dia |
| `/ordenar` | Cuando entrada/ tiene elementos |
| `/proyecto` | Antes de empezar algo con final y varios pasos |
| `/tareas` | Con el proyecto aprobado |
| `/avanzar` | Una tarea por vez |
| `/revisar` | Al terminar tareas o antes de cerrar |
| `/cerrar` | Cuando el criterio de cierre se cumple |
| `validar-vault` | Interna: corre las verificaciones del espacio |

## Subagentes

`organizador` planifica lo que toca varios archivos. `revisor` revisa calidad de lo recien escrito. `verificador` contrasta contra el criterio de cierre.

Los tres son de solo lectura a proposito: quien hizo el trabajo no puede firmarlo.

## Donde vive cada cosa

```
project.config.json   verificaciones y reglas de bloqueo. No se toca sin permiso
entrada/ proyectos/ areas/ recursos/ archivo/   el contenido (ver 20-organizacion)
state/                memoria entre sesiones y registro de archivos tocados
.cursor/rules/        reglas de conducta
.cursor/skills/       el ciclo y los validadores
.cursor/hooks/        lo que se hace cumplir solo
```

## Lo que se hace cumplir solo

No son sugerencias. Son hooks que corren pase lo que pase:

- Un comando de la lista de bloqueo **no se ejecuta**, tampoco envuelto en otra sintaxis. Explica que querias hacer y espera autorizacion.
- Un turno **no cierra** con enlaces rotos, tareas malformadas o proyectos sin criterio de cierre. Se te devuelve la tarea hasta 3 veces y despues se detiene todo.
- Cada archivo que editas queda registrado en `state/changed-files.json`. Es lo que leen los verificadores.
- Con todo en verde se guarda un punto de restauracion automatico.

## Si este espacio no tiene puntos de restauracion

Avisa antes de cualquier cambio amplio: no habra forma de deshacerlo entre sesiones. Propon `/historial`.
