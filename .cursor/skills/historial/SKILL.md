---
name: historial
description: Activa los puntos de restauracion automaticos del espacio. Se corre una sola vez, al instalar.
disable-model-invocation: true
---

# Activar el historial

Sin historial, un cambio que salio mal no se puede deshacer. Esta skill lo instala una vez y desde entonces es automatico: cada vez que un turno termina con todo en verde, se guarda un punto de restauracion solo.

## Proceso

1. Comprueba si ya existe: si hay carpeta `.git`, di que el historial ya esta activo y detente.
2. Corre `git init` en la raiz del espacio. (Es el unico comando de git que vas a correr a mano; los demas estan bloqueados a proposito.)
3. Comprueba que `.gitignore` existe. Si no, algo esta mal en la instalacion: dilo y detente.
4. Escribe en `state/workflow_state.md`, seccion Decisiones: `<fecha>: historial activado`.
5. Explica a la persona, sin jerga:
   - El primer punto de restauracion se guarda solo al cerrar este turno.
   - Para ver el historial o volver atras: panel **Source Control** en la barra lateral izquierda de Cursor. Clic derecho sobre un punto para restaurarlo.
   - Esto NO es un respaldo: vive en el mismo disco. Sigue necesitando copia externa y en la nube.

## Nota tecnica

El commit inicial no lo haces tu: el hook `stop` guarda el punto de restauracion automaticamente porque este turno edito `state/workflow_state.md`. Por eso el paso 4 no es opcional.
