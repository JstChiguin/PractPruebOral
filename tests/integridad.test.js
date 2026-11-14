const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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
  assert.match(configuracion, /version:\s*'1\.0\.0'/);
  assert.match(html, /id="version"/);
  assert.match(codigo, /configuracion\.version/);
});

test('hay cinco preguntas y cuatro frases en la respuesta larga', () => {
  assert.equal((datos.match(/tema:/g) || []).length, 5);
  assert.equal((datos.match(/ingles:/g) || []).length, 15);
});

test('los archivos están vinculados y no hay código comentado', () => {
  for (const archivo of ['styles.css', 'config.js', 'datos.js', 'script.js']) assert.ok(html.includes(`"${archivo}"`));
  for (const contenido of [html, estilos, codigo, configuracion, datos]) {
    assert.doesNotMatch(contenido, /<!--|\/\*|^\s*\/\//m);
  }
});
