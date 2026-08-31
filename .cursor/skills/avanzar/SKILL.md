---
name: avanzar
description: Trabaja UNA tarea de un proyecto, deja evidencia y se detiene.
disable-model-invocation: true
---

# Avanzar una tarea

**Una** tarea por vez. Nunca dos.

## Ciclo

1. **Lee.** El proyecto completo, la tarea, y toda nota o recurso que la tarea nombre. No edites un archivo que no abriste.

2. **Haz el trabajo que se pueda hacer aqui.** Redactar, comparar, organizar, investigar en los archivos del espacio, preparar el texto de un correo o una llamada. Lo que solo puede hacer la persona (llamar, firmar, pagar, ir), dejalo listo hasta el ultimo paso posible y dile exactamente que falta de su lado.

3. **Marca y fecha.** `- [x] la tarea (YYYY-MM-DD)`. Si la tarea quedo a medias porque falta la parte humana, NO la marques: agrega debajo una linea con lo que quedo listo y lo que falta.

4. **Deja evidencia.** En `## Notas` del proyecto, una o dos lineas: que se hizo y donde quedo (con `[[enlace]]` si se creo algo en recursos/).

5. **Verifica.** Corre la skill `validar-vault`. Al cerrar el turno el hook `stop` la corre igual; hacerlo antes te ahorra la vuelta.

## Prohibido

- Empezar la siguiente tarea sin que la persona lo pida.
- Marcar hecha una tarea cuya parte humana no ha pasado.
- Reorganizar archivos que la tarea no nombra.
- Rodear un comando bloqueado con otra sintaxis.

## Salida

```
Tarea:     <cual>
Se hizo:   <en una o dos lineas>
Falta:     <lo que depende de la persona, o "nada">
Siguiente: <la proxima tarea del proyecto, solo nombrarla>
```

Y detente.
