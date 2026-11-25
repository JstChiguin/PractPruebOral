const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const directorio = path.join(__dirname, '..');

function crearAplicacionSimulada() {
  const reproducciones = [];
  const tareas = [];
  const elementos = new Map();

  class Elemento {
    constructor(etiqueta = 'div') {
      this.etiqueta = etiqueta;
      this.hijos = [];
      this.atributos = {};
      this.eventos = {};
      this.dataset = {};
      this.textContent = '';
      this.hidden = false;
      this.clases = new Set();
      this.classList = {
        add: nombre => this.clases.add(nombre),
        remove: nombre => this.clases.delete(nombre),
        contains: nombre => this.clases.has(nombre),
        toggle: (nombre, activo) => {
          if (activo) this.clases.add(nombre);
          else this.clases.delete(nombre);
        }
      };
    }
    set className(valor) {
      this.clases = new Set(valor.split(' ').filter(Boolean));
    }
    append(...hijos) {
      this.hijos.push(...hijos);
    }
    addEventListener(nombre, manejador) {
      this.eventos[nombre] = manejador;
    }
    setAttribute(nombre, valor) {
      this.atributos[nombre] = valor;
    }
    getAttribute(nombre) {
      return this.atributos[nombre];
    }
    click() {
      this.eventos.click();
    }
    scrollIntoView() {}
  }

  for (const id of ['contenido-conversacion', 'contenido-predicciones', 'version', 'velocidad-audio', 'bucle-audio', 'aleatoria', 'aviso-bucle']) {
    elementos.set(id, new Elemento());
  }
  const botonesSecuencia = [new Elemento('button'), new Elemento('button')];
  botonesSecuencia[0].dataset.reproducirTodo = 'conversacion';
  botonesSecuencia[0].textContent = '▶ Escuchar todo seguido';
  botonesSecuencia[1].dataset.reproducirTodo = 'predicciones';
  botonesSecuencia[1].textContent = '▶ Escuchar respuesta completa';
  const pestañas = [new Elemento('button'), new Elemento('button')];
  pestañas[0].dataset.seccion = 'conversacion';
  pestañas[1].dataset.seccion = 'predicciones';
  const secciones = [new Elemento(), new Elemento()];
  secciones[0].id = 'conversacion';
  secciones[1].id = 'predicciones';

  const sintetizador = {
    speak(mensaje) {
      reproducciones.push(mensaje);
    },
    cancel() {}
  };
  const documento = {
    createElement: etiqueta => new Elemento(etiqueta),
    getElementById: id => elementos.get(id),
    querySelectorAll: selector => ({ '.section': secciones, '.tab': pestañas, '[data-reproducir-todo]': botonesSecuencia })[selector] || []
  };
  const ventana = {
    speechSynthesis: sintetizador,
    setTimeout: manejador => {
      tareas.push(manejador);
      return tareas.length;
    },
    clearTimeout: () => {
      tareas.length = 0;
    },
    addEventListener() {}
  };
  class Mensaje {
    constructor(texto) {
      this.text = texto;
    }
  }
  const contexto = vm.createContext({ document: documento, window: ventana, SpeechSynthesisUtterance: Mensaje });
  for (const archivo of ['config.js', 'datos.js', 'script.js']) vm.runInContext(fs.readFileSync(path.join(directorio, archivo), 'utf8'), contexto);
  const grupos = elementos.get('contenido-conversacion').hijos;
  const interruptores = grupos.map(grupo => grupo.hijos[0].hijos[1]);
  const avanzarAudio = () => {
    reproducciones.at(-1).onend();
    const pendientes = tareas.splice(0);
    pendientes.forEach(manejador => manejador());
  };
  return { elementos, reproducciones, tareas, interruptores, grupos, botonesSecuencia, avanzarAudio };
}

test('cada pregunta de la Parte 1 posee interruptor accesible ON/OFF independiente', () => {
  const aplicacion = crearAplicacionSimulada();
  assert.equal(aplicacion.interruptores.length, 3);
  for (let indice = 0; indice < 3; indice += 1) {
    const interruptor = aplicacion.interruptores[indice];
    assert.equal(interruptor.textContent, 'Bucle: ON');
    assert.equal(interruptor.getAttribute('role'), 'switch');
    assert.equal(interruptor.getAttribute('aria-checked'), 'true');
    interruptor.click();
    assert.equal(interruptor.textContent, 'Bucle: OFF');
    assert.equal(interruptor.getAttribute('aria-checked'), 'false');
    assert.equal(aplicacion.grupos[indice].classList.contains('sin-bucle'), true);
  }
  aplicacion.interruptores[1].click();
  assert.equal(aplicacion.interruptores[1].textContent, 'Bucle: ON');
  assert.equal(aplicacion.interruptores[0].textContent, 'Bucle: OFF');
});

test('el bucle reproduce la pregunta de Vicke y sus tres respuestas y luego repite', () => {
  const aplicacion = crearAplicacionSimulada();
  for (const indice of [0, 2]) aplicacion.interruptores[indice].click();
  aplicacion.elementos.get('bucle-audio').click();
  aplicacion.botonesSecuencia[0].click();
  assert.match(aplicacion.reproducciones.at(-1).text, /What were you doing yesterday at 8 p\.m\./);
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /studying English/);
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /oral exam/);
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /watched TV/);
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /What were you doing yesterday/);
});

test('la pregunta para Vicke se reproduce sin inventar una respuesta', () => {
  const aplicacion = crearAplicacionSimulada();
  aplicacion.botonesSecuencia[0].click();
  assert.equal(aplicacion.reproducciones.at(-1).text, 'What are your plans for the next five years?');
  aplicacion.avanzarAudio();
  assert.equal(aplicacion.reproducciones.at(-1).text, 'What were you doing yesterday at 8 p.m.?');
});

test('si todas están OFF, se muestra aviso; sin bucle se reproducen todas', () => {
  const aplicacion = crearAplicacionSimulada();
  aplicacion.interruptores.forEach(interruptor => interruptor.click());
  aplicacion.elementos.get('bucle-audio').click();
  aplicacion.botonesSecuencia[0].click();
  assert.equal(aplicacion.reproducciones.length, 0);
  assert.match(aplicacion.elementos.get('aviso-bucle').textContent, /Activa al menos una/);
  aplicacion.elementos.get('bucle-audio').click();
  aplicacion.botonesSecuencia[0].click();
  assert.match(aplicacion.reproducciones.at(-1).text, /plans for the next five years/);
});

test('el botón individual escucha la pregunta en OFF sin repetirla', () => {
  const aplicacion = crearAplicacionSimulada();
  aplicacion.interruptores[0].click();
  aplicacion.elementos.get('bucle-audio').click();
  const botonIndividual = aplicacion.grupos[0].hijos.find(elemento => elemento.etiqueta === 'article').hijos.at(-1);
  botonIndividual.click();
  assert.equal(aplicacion.reproducciones.length, 1);
  aplicacion.avanzarAudio();
  assert.equal(aplicacion.reproducciones.length, 1);
  assert.equal(botonIndividual.textContent, '▶ Escuchar');
});

test('el cambio de ON/OFF durante el bucle se aplica en la frase siguiente', () => {
  const aplicacion = crearAplicacionSimulada();
  aplicacion.elementos.get('bucle-audio').click();
  aplicacion.botonesSecuencia[0].click();
  assert.match(aplicacion.reproducciones.at(-1).text, /plans for the next five years/);
  aplicacion.interruptores[0].click();
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /What were you doing yesterday/);
});

test('la secuencia de la Parte 2 no depende de los interruptores de la Parte 1', () => {
  const aplicacion = crearAplicacionSimulada();
  aplicacion.interruptores.forEach(interruptor => interruptor.click());
  aplicacion.elementos.get('bucle-audio').click();
  aplicacion.botonesSecuencia[1].click();
  assert.match(aplicacion.reproducciones.at(-1).text, /In five years/);
  aplicacion.avanzarAudio();
  assert.match(aplicacion.reproducciones.at(-1).text, /software developer/);
});
