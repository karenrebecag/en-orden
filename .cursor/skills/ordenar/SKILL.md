---
name: ordenar
description: Vacia entrada/ clasificando cada elemento en proyectos, areas, recursos o una tarea de un proyecto existente.
disable-model-invocation: true
---

# Ordenar la entrada

`entrada/` es donde la persona tira lo que trae en la cabeza sin decidir donde va. Tu trabajo es decidirlo con ella y dejar la carpeta vacia.

## Por cada elemento, en orden

Hazte estas preguntas y detente en la primera que aplique:

1. **¿Es una tarea de un proyecto que ya existe?** Agregala como `- [ ]` en ese proyecto y borra el elemento de entrada.
2. **¿Es algo con final, que requiere varios pasos?** Es un proyecto nuevo: propon crearlo con `/proyecto`. No lo crees tu directo; el criterio de cierre se escribe con la persona.
3. **¿Es algo permanente, sin fecha de fin?** (salud, casa, finanzas, una relacion, un habito) Va a `areas/`, en el archivo del area que corresponda o uno nuevo.
4. **¿Es informacion que sirve para despues?** (una receta, un articulo, un dato, una idea) Va a `recursos/`, con titulo claro y `[[enlaces]]` a lo que se relacione.
5. **¿No es nada de lo anterior?** Preguntale a la persona que quiere hacer con eso. No lo clasifiques a ciegas.

## Reglas

- Un elemento a la vez, en el orden en que estan. Di a donde lo mandas y por que, en una linea.
- Si dudas entre dos destinos, pregunta. Una nota bien archivada en el lugar equivocado esta perdida igual.
- Al mover contenido, actualiza los `[[enlaces]]` que apunten a el.
- Al terminar, `entrada/` queda vacia (solo su README) y lo dices explicitamente.
