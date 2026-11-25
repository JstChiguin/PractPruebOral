const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const directorio = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(directorio, 'index.html'), 'utf8');
const estilos = fs.readFileSync(path.join(directorio, 'styles.css'), 'utf8');
const codigo = fs.readFileSync(path.join(directorio, 'script.js'), 'utf8');
const configuracion = fs.readFileSync(path.join(directorio, 'config.js'), 'utf8');
const datos = fs.readFileSync(path.join(directorio, 'datos.js'), 'utf8');

test('la firma conserva exactamente by Chiguin', () => {
  const firmas = [...html.matchAll(/<span class="firma-texto">([^<]+)<\/span>/g)];
  assert.equal(firmas.length, 1);
  assert.equal(firmas[0][1], 'by Chiguin');
});

test('la firma permanece visible y fija abajo a la derecha', () => {
  assert.match(html, /<footer id="firma-autor" class="watermark"/);
  assert.match(estilos, /\.watermark\s*\{[^}]*position:\s*fixed\s*;[^}]*bottom:\s*\d+px\s*;[^}]*right:\s*\d+px\s*;/s);
  assert.doesNotMatch(estilos, /\.watermark\s*\{[^}]*display:\s*none/s);
  assert.doesNotMatch(estilos, /\.watermark\s*\{[^}]*visibility:\s*hidden/s);
  assert.doesNotMatch(estilos, /\.watermark\s*\{[^}]*opacity:\s*0\s*;/s);
});

test('la versión procede de configuración centralizada', () => {
  const version = JSON.parse(fs.readFileSync(path.join(directorio, 'package.json'), 'utf8')).version;
  assert.ok(configuracion.includes(`version: '${version}'`));
  assert.match(html, /id="version"/);
  assert.match(codigo, /configuracion\.version/);
});

test('los ejercicios del examen están completos y con estructura válida', () => {
  const contenido = vm.runInNewContext(`${datos}\n({ preguntasOrales, prediccionesOrales })`);
  assert.equal(contenido.preguntasOrales.length, 3);
  assert.equal(contenido.preguntasOrales[0].pregunta.ingles, 'What are your plans for the next five years?');
  assert.equal(contenido.preguntasOrales[0].respuesta, undefined);
  assert.equal(contenido.preguntasOrales[1].pregunta.ingles, 'What were you doing yesterday at 8 p.m.?');
  assert.equal(contenido.preguntasOrales[1].respuestas.length, 3);
  assert.equal(contenido.preguntasOrales[2].respuesta.ingles, 'Yes, I have already eaten.');
  assert.equal(contenido.prediccionesOrales.respuestas.length, 4);
  for (const ejercicio of contenido.preguntasOrales) {
    assert.ok(ejercicio.tema);
    assert.ok(ejercicio.pregunta.ingles && ejercicio.pregunta.pronunciacion && ejercicio.pregunta.traduccion);
    for (const respuesta of ejercicio.respuestas || (ejercicio.respuesta ? [ejercicio.respuesta] : [])) {
      assert.ok(respuesta.ingles && respuesta.pronunciacion && respuesta.traduccion);
    }
  }
});

test('los archivos están vinculados y no hay código comentado', () => {
  for (const archivo of ['styles.css', 'config.js', 'datos.js', 'script.js']) assert.ok(html.includes(`"${archivo}"`));
  for (const contenido of [html, estilos, codigo, configuracion, datos]) {
    assert.doesNotMatch(contenido, /<!--|\/\*|^\s*\/\//m);
  }
});

test('los controles de bucle y velocidad están disponibles en ambas partes', () => {
  assert.match(html, /id="velocidad-audio"/);
  assert.match(html, /id="bucle-audio"[^>]*aria-pressed="false"/);
  for (const valor of ['0.5', '0.75', '0.85', '1', '1.25']) {
    assert.ok(html.includes(`value="${valor}"`));
  }
  assert.match(codigo, /mensaje\.rate = velocidadActual/);
  assert.match(codigo, /bucleActivo/);
  assert.match(codigo, /clearTimeout\(esperaAudio\)/);
  assert.match(codigo, /indice = 0/);
  assert.match(estilos, /\.bucle-btn\[aria-pressed="true"\]/);
});
