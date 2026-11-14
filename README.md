# 🎧 Práctica de Inglés B1 — Evaluación Oral

Aplicación web interactiva para estudiar y practicar la evaluación oral de inglés B1.

Desarrollada para facilitar la memorización de preguntas, respuestas, pronunciación y traducciones mediante reproducción de audio en inglés.

La aplicación funciona directamente desde el navegador, sin necesidad de instalar programas, crear cuentas ni contratar servicios.

## 🎯 Objetivo

Preparar las dos partes de la evaluación oral de inglés.

### Parte 1 — Conversación con una compañera

El profesor seleccionará al azar uno de cinco tipos de preguntas. El estudiante deberá formular la pregunta en inglés a su compañera.

Por este motivo, la aplicación permite practicar tanto las preguntas como sus respuestas.

Los cinco tipos son:

1. **Have you ever...?** — ¿Alguna vez has...?
2. **What's the best...?** — ¿Cuál es el mejor...?
3. **What's the worst...?** — ¿Cuál es el peor...?
4. **What's the most...?** — ¿Cuál es el más...?
5. **Have you ... yet?** — ¿Ya has...?

Cada ejercicio incluye:

- Pregunta en inglés.
- Pronunciación aproximada para hispanohablantes.
- Traducción al español.
- Respuesta de ejemplo.
- Audio para practicar la pronunciación.

También incluye selección aleatoria de preguntas para simular la evaluación.

### Parte 2 — Predicciones personales

El profesor realizará la siguiente pregunta:

**Make two predictions about yourself in the next 5 years.**

*Haz dos predicciones sobre ti para los próximos cinco años.*

La aplicación contiene una respuesta desarrollada sobre:

- Finalizar los estudios.
- Trabajar en informática.
- Desarrollar aplicaciones.
- Aprender nuevas tecnologías.
- El deseo de vivir en Canadá con la familia.

El objetivo es practicar la respuesta completa hasta poder expresarla con naturalidad y fluidez.

## 🔊 Funcionalidades

- Reproducción de audio en inglés mediante el navegador.
- Botón para escuchar cada pregunta y respuesta.
- Reproducción continua de frases.
- Selección aleatoria de preguntas.
- Pronunciación aproximada escrita en español.
- Traducción de los contenidos.
- Navegación entre las partes de la evaluación.
- Diseño adaptable a computadores, tablets y teléfonos.
- Firma flotante **by Chiguin**.
- Versión de la aplicación definida en una configuración central.

## 🗂️ Estructura del proyecto

```text
PractPruebOral2/
├── index.html
├── styles.css
├── script.js
├── datos.js
├── config.js
├── package.json
├── README.md
├── tests/
│   └── integridad.test.js
└── img/
```

### Descripción de archivos

| Archivo | Función |
|---|---|
| `index.html` | Estructura principal de la aplicación. |
| `styles.css` | Diseño visual, colores y firma flotante. |
| `script.js` | Navegación, reproducción de audio y selección aleatoria. |
| `datos.js` | Preguntas, respuestas, pronunciaciones y traducciones. |
| `config.js` | Configuración centralizada y versión. |
| `package.json` | Comandos para ejecutar las verificaciones. |
| `tests/integridad.test.js` | Pruebas automatizadas de integridad y contenido. |
| `img/` | Recursos gráficos del repositorio. |

## 🚀 Cómo utilizar la aplicación

1. Abrir la aplicación en un navegador compatible.
2. Seleccionar la sección de conversación o predicciones.
3. Leer la pregunta en inglés.
4. Escuchar su pronunciación mediante el botón de audio.
5. Repetir la frase en voz alta.
6. Revisar la traducción para comprender su significado.
7. Practicar la respuesta sin leerla.
8. Utilizar la selección aleatoria para simular la evaluación.

**Recomendación:** practicar primero las preguntas y respuestas por separado y, posteriormente, realizar simulaciones completas.

## 🌐 Publicación con GitHub Pages

El proyecto puede publicarse gratuitamente usando GitHub Pages.

### Pasos

1. Abrir el repositorio en GitHub.
2. Subir los archivos mediante **Add file → Upload files**.
3. Confirmar los cambios en una rama de trabajo.
4. Integrar los cambios en `main` mediante Pull Request, cuando corresponda.
5. Abrir **Settings → Pages**.
6. En **Build and deployment**, seleccionar **Deploy from a branch**.
7. Elegir la rama `main` y la carpeta `/ (root)`.
8. Guardar la configuración.

Cuando GitHub Pages termine la publicación, la aplicación estará disponible desde el enlace generado por GitHub.

## 🛠️ Tecnologías utilizadas

- **HTML5:** estructura de la interfaz.
- **CSS3:** estilos y diseño adaptable.
- **JavaScript:** lógica e interactividad.
- **Web Speech API:** reproducción de voz mediante síntesis de voz del navegador.
- **GitHub Pages:** alojamiento web estático gratuito.

No se requiere backend ni base de datos.

La disponibilidad de voces y la calidad de la pronunciación dependen del navegador y del sistema operativo.

## 🧪 Pruebas

El proyecto incluye pruebas automatizadas para comprobar aspectos relevantes de su integridad.

Con Node.js instalado:

```bash
npm test
```

Para ejecutar las verificaciones configuradas como compilación:

```bash
npm run build
```

Los comandos no requieren instalar dependencias adicionales.

## 🔒 Privacidad y costos

La aplicación:

- No solicita nombres, contraseñas ni información personal.
- No utiliza autenticación ni almacenamiento de datos personales.
- No necesita servidores propios.
- No requiere servicios de pago.
- Puede utilizarse gratuitamente desde un navegador.

Las preguntas y respuestas incluidas corresponden a ejemplos de estudio.

## ✍️ Autoría

**by Chiguin**

Versión inicial: `v1.0.0`

La versión se administra desde `config.js`.

La firma de autoría aparece de forma flotante en la esquina inferior derecha de la interfaz.

---

Proyecto educativo desarrollado para facilitar el aprendizaje y la práctica del inglés mediante herramientas web gratuitas.
