# Práctica de inglés — Evaluación oral

Aplicación web gratuita, sin servidor ni cuentas, para practicar la evaluación oral B1.

## Contenidos

- Parte 1: cinco preguntas y respuestas para practicar con una compañera.
- Parte 2: respuesta extendida sobre dos predicciones para los próximos cinco años.
- Texto en inglés, aproximación de pronunciación en español y traducción.
- Reproducción por frase, reproducción continua y selección aleatoria de preguntas.
- Firma «by Chiguin» y versión desde una configuración central.

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: apariencia y firma flotante.
- `config.js`: versión y ajustes de reproducción.
- `datos.js`: preguntas, respuestas, pronunciación y traducciones.
- `script.js`: navegación, tarjetas, audio y pregunta aleatoria.
- `tests/integridad.test.js`: comprobaciones automatizadas de integridad y contenido.

## Subir desde la página web de GitHub

1. Abre tu repositorio en GitHub y selecciona la rama donde trabajarás, idealmente una rama nueva creada a partir de `develop` si existe.
2. Pulsa **Add file → Upload files**.
3. Arrastra los archivos y la carpeta `tests` desde tu computador, manteniendo esa estructura.
4. Revisa el resumen de cambios y confirma el commit con tu identidad de GitHub.
5. Si GitHub Pages está habilitado, entra en **Settings → Pages**, elige **Deploy from a branch** y selecciona la rama y carpeta raíz correspondientes.

La página puede abrirse directamente desde `index.html`; el audio utiliza la voz de inglés que ofrece el navegador y requiere un navegador compatible. La apariencia usa Inter cuando Google Fonts está disponible, con una alternativa local cuando no lo está.

## Pruebas

Con Node.js instalado, ejecuta `npm test` o `npm run build`. No se necesitan paquetes adicionales.

## Privacidad

No requiere datos personales, claves ni servicios de pago. Las preguntas y respuestas de estudio son ejemplos de práctica.
