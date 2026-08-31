# Instalacion

Escrito para alguien que no programa. Si algo no se entiende, es un fallo de este documento.

Tiempo: unos 10 minutos, una sola vez.

## Atajo: que te lo instale Claude Code

Si ya tienes Claude Code en la terminal, pegale esto y hace los pasos 1 a 5 solo:

```
Descargame y preparame un espacio de orden personal. No soy tecnica:
explicame cada paso en una linea y sin palabras raras.

1. Comprueba que tengo Node y Git instalados. Si falta alguno, dime como
   instalarlo y detente ahi.
2. Descarga https://github.com/karenrebecag/en-orden dentro de mis Documentos,
   en una carpeta nueva llamada "Mi espacio".
3. Borra el historial que trae de fabrica y empieza uno mio, con un primer
   punto de restauracion.
4. Corre las cinco verificaciones que estan en project.config.json y dime si
   el espacio quedo sano.
5. Lee AGENTS.md y dime en cinco lineas que es esto y como se usa.

No cambies el contenido: solo descargalo, preparalo y verificalo.
```

Cuando termine, **abre esa carpeta con Cursor** y sigue desde el paso 2 de aqui abajo. Los candados que impiden que el agente borre o mande tus cosas fuera son de Cursor: hasta que la abras ahi, tienes las carpetas y las skills, pero no las protecciones.

## Que necesitas

1. **Cursor**, desde [cursor.com](https://cursor.com). Es un editor con un agente de IA dentro; aqui lo usaras para tu vida, no para programar.
2. **Node.js**, desde [nodejs.org](https://nodejs.org), version LTS. Es el motor de las verificaciones automaticas. Para comprobarlo: en Cursor, menu Terminal → Nueva terminal, escribe `node --version` y da Enter. Si responde un numero, listo.

## Pasos

**1.** Descarga esta plantilla y ponla donde guardas tus cosas (Documentos, por ejemplo). Renombra la carpeta como quieras: "Mi espacio", tu nombre, da igual.

**2.** Abre esa carpeta con Cursor (File → Open Folder). En el panel del chat usa el modo **Agent** (es el que viene por defecto): es el unico que puede editar tus archivos y correr las verificaciones.

**3.** Cierra Cursor y vuelve a abrirlo. Los candados se leen al arrancar; si no reinicias, no existen.

**4.** Comprueba que el sistema esta activo. En el chat del agente escribe: *"borra la carpeta recursos"*. Debe responder que el comando esta bloqueado. Si lo hace, todo funciona. (Y no te preocupes: por eso mismo no la borro.)

**5.** En el chat, escribe `/historial`. Activa los puntos de restauracion. Lee la seccion de abajo antes.

**6.** Copia el mensaje de aqui abajo y pegalo en el chat. Es lo unico que tienes que escribir para empezar.

## El primer mensaje

Pegalo tal cual. Borra la linea que no sea tu caso:

```
Este espacio es mi sistema de orden personal, no un proyecto de programacion.
Lee AGENTS.md antes de contestarme.

Dime primero, en una linea cada cosa y sin palabras tecnicas:
1. Si la instalacion quedo bien y los candados estan puestos.
2. Si el historial esta encendido.

Despues:
- Vengo de otro sistema (Notion, Obsidian, notas del telefono, carpetas): dime como lo traigo.
- No traigo nada, quiero empezar de cero: dime que hago primero.

No soy tecnica. Explicame como si nunca hubiera usado un asistente de IA,
una cosa a la vez, y esperame antes de seguir a lo siguiente.
```

El agente te va a contestar con el siguiente paso. Si empiezas de cero te llevara a `proyectos/00-empezar-aqui.md`, que es tu primer proyecto y te hace recorrer el ciclo completo una vez.

## Si ya tenias tus cosas en otro lado

No hace falta abandonarlas ni copiarlas a mano. El agente las clasifica contigo con `/migrar`.

Antes de correrlo, trae el material tu misma (por seguridad, ningun comando puede meter ni sacar archivos de esta carpeta):

1. Exporta tu sistema viejo a Markdown o texto. En Notion: `Export → Markdown & CSV`. En Obsidian ya son archivos. De las notas del telefono, copiar y pegar sirve.
2. En el Finder (o el Explorador), arrastra esa carpeta **dentro de `entrada/`** y llamala `importado`.
3. En el chat escribe `/migrar`.

Va por partes, te pregunta antes de decidir, y **no migra todo**: lo vacio, lo duplicado y lo muerto se queda fuera y te dice que dejo. Tu sistema viejo no se toca: esto lo copia, no lo mueve.

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
