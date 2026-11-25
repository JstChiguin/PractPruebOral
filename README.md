# Práctica de inglés — Evaluación oral

Aplicación web gratuita, sin servidor ni cuentas, para practicar la evaluación oral B1.

## Contenidos

- Parte 1: tres ejercicios: pregunta sobre planes futuros para Vicke, pregunta de Vicke sobre el pasado con tu respuesta de tres frases, y una pregunta adicional con Present Perfect.
- Parte 2: pregunta del profesor sobre los planes profesionales y personales de los próximos cinco años, con cuatro frases de respuesta.
- Texto en inglés, aproximación de pronunciación en español y traducción.
- Reproducción por frase, reproducción continua, bucle, velocidades ajustables y selección aleatoria de preguntas.
- Interruptores ON/OFF independientes en cada pregunta de la Parte 1 para seleccionar qué ejercicio y sus frases se repiten.
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

## Controles de audio

- **Velocidad:** permite elegir 0.5×, 0.75×, 0.85×, 1× o 1.25×. Al modificarla se detiene la reproducción actual; inicia el audio nuevamente para aplicar la nueva velocidad.
- **Bucle:** repite automáticamente una frase o la secuencia completa mientras esté activado. Presiona **Detener** para finalizar.
- **Parte 1, ON/OFF:** cada interruptor incluye u omite del bucle la pregunta y las respuestas disponibles. Al activar el bucle, **Escuchar todo seguido** solo recorre los ejercicios en ON. Con el bucle desactivado, reproduce los tres ejercicios una sola vez. El botón individual **Escuchar** siempre permite oír la frase; si su ejercicio está en OFF, no se repite en bucle. Los cambios ON/OFF se aplican durante la reproducción desde la frase siguiente. La pregunta para Vicke no incluye respuesta inventada; la pregunta sobre el pasado tiene tres respuestas separadas para facilitar su práctica.
- Si todas las preguntas están en OFF y se intenta reproducir en bucle, aparece un aviso sin bloquear la interfaz.
- El bucle y la velocidad funcionan en ambas partes de la práctica.
