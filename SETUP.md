# Instalacion

Escrito para alguien que no programa. Si algo no se entiende, es un fallo de este documento.

Tiempo: unos 10 minutos, una sola vez.

## Que necesitas

1. **Cursor**, desde [cursor.com](https://cursor.com). Es un editor con un agente de IA dentro; aqui lo usaras para tu vida, no para programar.
2. **Node.js**, desde [nodejs.org](https://nodejs.org), version LTS. Es el motor de las verificaciones automaticas. Para comprobarlo: en Cursor, menu Terminal → Nueva terminal, escribe `node --version` y da Enter. Si responde un numero, listo.

## Pasos

**1.** Descarga esta plantilla y ponla donde guardas tus cosas (Documentos, por ejemplo). Renombra la carpeta como quieras: "Mi espacio", tu nombre, da igual.

**2.** Abre esa carpeta con Cursor (File → Open Folder). En el panel del chat usa el modo **Agent** (es el que viene por defecto): es el unico que puede editar tus archivos y correr las verificaciones.

**3.** Cierra Cursor y vuelve a abrirlo. Los candados se leen al arrancar; si no reinicias, no existen.

**4.** Comprueba que el sistema esta activo. En el chat del agente escribe: *"borra la carpeta recursos"*. Debe responder que el comando esta bloqueado. Si lo hace, todo funciona. (Y no te preocupes: por eso mismo no la borro.)

**5.** En el chat, escribe `/historial`. Activa los puntos de restauracion. Lee la seccion de abajo antes.

**6.** Abre `proyectos/00-empezar-aqui.md`. Es tu primer proyecto y te guia por el resto.

## Sobre el historial

Un agente de IA edita muchos archivos rapido. Sin historial, un cambio que salio mal **no se puede deshacer**.

`/historial` lo resuelve sin que aprendas nada tecnico. Desde que lo corres, cada vez que el agente termina con todo en verde se guarda un punto de restauracion solo. Tu nunca escribes un comando.

Para ver el historial o volver atras: el panel **Source Control** en la barra lateral izquierda de Cursor. Es una lista de cambios con fecha; clic derecho sobre uno para volver a ese punto.

**Esto no es un respaldo.** Vive en el mismo disco que tu carpeta. Si se pierde la computadora, se pierde todo. Necesitas ademas una copia en disco externo o en la nube (iCloud, Drive o similar sincronizando la carpeta sirve).

## Trampas conocidas

**Si borras `project.config.json`, los candados se apagan.** Es el archivo que contiene la lista de bloqueos y verificaciones. El agente te avisara al abrir sesion si falta.

**Si una verificacion falla siempre y no entiendes por que**, pidele al agente: "explicame que verificacion esta fallando y por que". No borres contenido para que pase: la verificacion esta senalando algo real.

**Los datos sensibles no van aqui.** Contrasenas, PINs y tarjetas van en un gestor de contrasenas. El sistema avisa si detecta algo asi, pero la primera barrera eres tu.

## Dos costumbres que ayudan

**Cierra el chat sin miedo.** Todo lo que importa queda escrito en tus archivos, no en la conversacion: el estado del trabajo se recarga solo al abrir sesion nueva. Si un chat se hizo largo o confuso, abre uno nuevo y sigue donde ibas.

**Puedes dictar en vez de teclear.** El dictado del sistema funciona en el chat de Cursor (en Mac: tecla fn dos veces; en Windows: Win+H). Para vaciar lo que traes en la cabeza hacia `entrada/`, hablar suele ser mas rapido que escribir.

## El primer dia

```
/historial
/hoy
```

`/hoy` te propondra el proyecto "Empezar aqui". Siguelo: te hace pasar por todo el ciclo una vez con cosas tuyas, y al cerrarlo el espacio queda funcionando.
