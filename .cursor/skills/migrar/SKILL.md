---
name: migrar
description: Trae a este espacio lo que la persona ya tenia en otro lado (Notion, Obsidian, notas del telefono, carpetas de documentos) clasificandolo en la estructura correcta. Se corre una vez, en varios turnos.
disable-model-invocation: true
---

# Migrar lo que ya tenias

Traer un sistema viejo entero es la forma mas rapida de que el nuevo nazca hecho un basurero. Migrar no es copiar: es **decidir, cosa por cosa, si merece seguir existiendo** y donde va.

Esta skill se corre en varios turnos. No intentes terminarla en uno.

## Antes de empezar: el archivo lo trae la persona

El espacio no deja que ningun comando meta ni saque archivos de la carpeta, y eso incluye traer un export. **Lo mueve la persona a mano**, y se lo explicas asi:

1. Exporta tu sistema viejo a Markdown o texto (en Notion: Export → Markdown; en Obsidian ya son archivos; en notas del telefono, copiar y pegar sirve).
2. En el Finder o el Explorador, arrastra esa carpeta **dentro de `entrada/`** y llamala `importado`.
3. Avisame cuando este ahi.

Si el export no es Markdown ni texto (una hoja de calculo, un PDF, un tablero de Trello en JSON), no lo conviertas tu solo: preguntale que hay dentro y resuman juntos lo que valga en una nota, en vez de volcar datos crudos.

## 1. Inventario, sin tocar nada

Cuenta que hay en `entrada/importado/`: cuantos archivos, de que tamano, que carpetas trae. Muestra diez titulos representativos.

Di cuanto vas a tardar en lotes y pregunta si quiere seguir. **En este paso no se migra nada.**

## 2. Calibrar con una muestra

Toma ocho elementos variados y clasificalos **en voz alta**, sin escribir todavia: este es proyecto, este area, este recurso, este no vale la pena. Una linea cada uno, con el porque.

Pregunta si esta de acuerdo. Aqui es donde se corrige el criterio; si empiezas por los doscientos, los doscientos salen mal.

## 3. Por lotes, con un punto de restauracion cada uno

Diez elementos por turno como maximo. Este es **el unico trabajo que supera el limite de cinco archivos por tarea**, y lo hace a proposito: cada lote cierra su turno, guarda su punto de restauracion, y se puede deshacer solo.

Al terminar cada lote: di que entro, donde, y que quedo pendiente. Y detente.

## Donde va cada cosa

Se decide con `20-organizacion.mdc`, igual que en `/ordenar`. Dos reglas propias de la migracion:

- **Un proyecto importado necesita criterio de cierre.** Si no se puede escribir como se ve terminado, no es un proyecto: es un area (si es permanente) o un recurso (si es solo informacion). No lo fuerces a `proyectos/`; la verificacion lo va a rechazar y con razon.
- **Lo terminado va directo a `archivo/`**, con su seccion de cierre aunque sea de una linea. No lo revivas como activo solo porque estaba en la lista vieja.

## Lo que no se migra

Decir que no es la mitad del trabajo. No entran:

- Notas vacias, o que son solo un titulo.
- Duplicados: se queda la mas completa y se anota que hubo otra.
- Proyectos muertos hace mas de un ano: van a `archivo/` con una linea, o no van.
- Listas de pendientes viejas que ya nadie va a hacer. Preguntale antes de tirarlas, pero preguntale.
- **Contrasenas, PINs, tarjetas o claves de cualquier tipo.** Eso no se migra nunca, se le dice que va en un gestor de contrasenas.

Lleva la cuenta de lo descartado. Al final se reporta, no se esconde.

## 4. Cerrar la migracion

Cuando `entrada/importado/` quede vacia:

1. Escribe `recursos/migracion-<YYYY-MM-DD>.md`: de donde venia, cuantas cosas entraron y a donde, cuantas se descartaron y por que. Es la unica memoria de lo que se dejo fuera.
2. Anota en `state/workflow_state.md`, en Decisiones: `<fecha>: migrado <sistema viejo>, ver [[migracion-<fecha>]]`.
3. Corre la skill `validar-vault` completa. Una migracion mueve mucho y es donde mas enlaces se rompen.
4. Dile que su sistema viejo puede seguir donde estaba: esto no lo borro, lo copio.

## Salida por lote

```
Lote:        <n> de <total>
Entraron:    <cuantos> — <a donde, en una linea>
Descartados: <cuantos> — <por que>
Falta:       <cuantos elementos>
```

Y detente.
