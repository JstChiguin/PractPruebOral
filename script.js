const sintetizador = window.speechSynthesis;
let botonActual = null;
let botonSecuencia = null;
let secuenciaActual = 0;
let velocidadActual = configuracion.velocidad;
let bucleActivo = false;
let esperaAudio = null;
const preguntasEnBucle = preguntasOrales.map(() => true);

function crearElemento(etiqueta, clase, contenido) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (contenido !== undefined) elemento.textContent = contenido;
  return elemento;
}

function detenerAudio() {
  secuenciaActual += 1;
  if (esperaAudio !== null) {
    window.clearTimeout(esperaAudio);
    esperaAudio = null;
  }
  sintetizador.cancel();
  if (botonActual) {
    botonActual.classList.remove('playing');
    botonActual.textContent = '▶ Escuchar';
    botonActual = null;
  }
  if (botonSecuencia) {
    botonSecuencia.classList.remove('playing');
    botonSecuencia.textContent = botonSecuencia.dataset.textoOriginal;
    botonSecuencia = null;
  }
}

function crearVoz(texto, alTerminar) {
  const mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = configuracion.idioma;
  mensaje.rate = velocidadActual;
  mensaje.pitch = 1;
  if (alTerminar) {
    mensaje.onend = alTerminar;
    mensaje.onerror = alTerminar;
  }
  sintetizador.speak(mensaje);
}

function reproducirFrase(boton, texto, indicePregunta = null) {
  const estabaActivo = botonActual === boton;
  detenerAudio();
  if (estabaActivo) return;
  const identificador = secuenciaActual;
  botonActual = boton;
  boton.classList.add('playing');
  boton.textContent = '⏹ Detener';
  let reproducciones = 0;
  const finalizar = () => {
    boton.classList.remove('playing');
    boton.textContent = '▶ Escuchar';
    botonActual = null;
  };
  const debeRepetir = () => bucleActivo && (indicePregunta === null || preguntasEnBucle[indicePregunta]);
  const repetir = () => {
    if (identificador !== secuenciaActual) return;
    if (reproducciones > 0 && !debeRepetir()) {
      finalizar();
      return;
    }
    reproducciones += 1;
    crearVoz(texto, () => {
      if (identificador !== secuenciaActual) return;
      if (debeRepetir()) {
        esperaAudio = window.setTimeout(repetir, configuracion.pausaEntreFrases);
      } else {
        finalizar();
      }
    });
  };
  repetir();
}

function crearTarjeta(tipo, frase, indicePregunta = null, etiquetaPersonalizada = null) {
  const tarjeta = crearElemento('article', 'card');
  tarjeta.dataset.text = frase.ingles;
  tarjeta.append(crearElemento('div', `label ${tipo}`, etiquetaPersonalizada || (tipo === 'pregunta' ? 'Pregunta' : tipo === 'respuesta' ? 'Respuesta' : 'Mi respuesta')));
  tarjeta.append(crearElemento('p', 'phrase-en', frase.ingles));
  tarjeta.append(crearElemento('p', 'phrase-pron', `🔊 ${frase.pronunciacion}`));
  tarjeta.append(crearElemento('p', 'phrase-es', frase.traduccion));
  const boton = crearElemento('button', 'speak-btn', '▶ Escuchar');
  boton.type = 'button';
  boton.addEventListener('click', () => reproducirFrase(boton, frase.ingles, indicePregunta));
  tarjeta.append(boton);
  return tarjeta;
}

function mostrarAvisoBucle(mensaje = '') {
  const aviso = document.getElementById('aviso-bucle');
  aviso.textContent = mensaje;
  aviso.hidden = !mensaje;
}

function actualizarInterruptorBucle(boton, grupo, indicePregunta) {
  const incluido = preguntasEnBucle[indicePregunta];
  boton.setAttribute('aria-checked', String(incluido));
  boton.textContent = incluido ? 'Bucle: ON' : 'Bucle: OFF';
  grupo.classList.toggle('sin-bucle', !incluido);
}

function obtenerRespuestasEjercicio(ejercicio) {
  return ejercicio.respuestas || (ejercicio.respuesta ? [ejercicio.respuesta] : []);
}

function mostrarPreguntas() {
  const contenedor = document.getElementById('contenido-conversacion');
  preguntasOrales.forEach((ejercicio, indice) => {
    const grupo = crearElemento('div', 'grupo-pregunta');
    grupo.id = `pregunta-${indice + 1}`;
    const encabezado = crearElemento('div', 'encabezado-pregunta');
    const titulo = crearElemento('h2', 'section-title', `${indice + 1}. ${ejercicio.tema}`);
    const interruptor = crearElemento('button', 'interruptor-bucle');
    interruptor.type = 'button';
    interruptor.setAttribute('role', 'switch');
    interruptor.setAttribute('aria-label', `Incluir pregunta ${indice + 1} y su respuesta en el bucle`);
    interruptor.addEventListener('click', () => {
      preguntasEnBucle[indice] = !preguntasEnBucle[indice];
      actualizarInterruptorBucle(interruptor, grupo, indice);
      mostrarAvisoBucle();
    });
    actualizarInterruptorBucle(interruptor, grupo, indice);
    encabezado.append(titulo, interruptor);
    grupo.append(encabezado);
    if (ejercicio.instruccion) grupo.append(crearElemento('p', 'instruccion-pregunta', ejercicio.instruccion));
    if (ejercicio.traduccionInstruccion) grupo.append(crearElemento('p', 'traduccion-instruccion', ejercicio.traduccionInstruccion));
    grupo.append(crearTarjeta('pregunta', ejercicio.pregunta, indice, ejercicio.etiquetaPregunta));
    obtenerRespuestasEjercicio(ejercicio).forEach((respuesta, indiceRespuesta) => {
      const etiqueta = ejercicio.respuestas && ejercicio.respuestas.length > 1 ? `Mi respuesta · parte ${indiceRespuesta + 1}` : 'Respuesta';
      grupo.append(crearTarjeta('respuesta', respuesta, indice, etiqueta));
    });
    if (indice !== preguntasOrales.length - 1) grupo.append(crearElemento('div', 'divider'));
    contenedor.append(grupo);
  });
}

function mostrarPredicciones() {
  const contenedor = document.getElementById('contenido-predicciones');
  contenedor.append(crearElemento('h2', 'section-title', 'Pregunta del profesor'));
  contenedor.append(crearTarjeta('pregunta', prediccionesOrales.pregunta));
  contenedor.append(crearElemento('h2', 'section-title', 'Respuesta completa para memorizar'));
  prediccionesOrales.respuestas.forEach(frase => contenedor.append(crearTarjeta('prediccion', frase)));
}

function reproducirSecuencia(boton, seccion) {
  const estabaActivo = botonSecuencia === boton;
  detenerAudio();
  if (estabaActivo) return;
  mostrarAvisoBucle();
  const frases = seccion === 'conversacion'
    ? preguntasOrales.flatMap((ejercicio, indicePregunta) => [
        { texto: ejercicio.pregunta.ingles, indicePregunta },
        ...obtenerRespuestasEjercicio(ejercicio).map(respuesta => ({ texto: respuesta.ingles, indicePregunta }))
      ])
    : prediccionesOrales.respuestas.map(frase => ({ texto: frase.ingles, indicePregunta: null }));
  const identificador = secuenciaActual;
  botonSecuencia = boton;
  boton.classList.add('playing');
  boton.textContent = '⏹ Detener';
  let indice = 0;
  const siguiente = () => {
    if (identificador !== secuenciaActual) return;
    let indiceSiguiente = indice;
    if (seccion === 'conversacion' && bucleActivo) {
      while (indiceSiguiente < frases.length && !preguntasEnBucle[frases[indiceSiguiente].indicePregunta]) indiceSiguiente += 1;
    }
    if (indiceSiguiente >= frases.length) {
      if (!bucleActivo) {
        detenerAudio();
        return;
      }
      indiceSiguiente = 0;
      if (seccion === 'conversacion') {
        while (indiceSiguiente < frases.length && !preguntasEnBucle[frases[indiceSiguiente].indicePregunta]) indiceSiguiente += 1;
      }
    }
    if (indiceSiguiente >= frases.length) {
      detenerAudio();
      mostrarAvisoBucle('Activa al menos una pregunta para reproducir el bucle.');
      return;
    }
    indice = indiceSiguiente + 1;
    crearVoz(frases[indiceSiguiente].texto, () => {
      if (identificador === secuenciaActual) esperaAudio = window.setTimeout(siguiente, configuracion.pausaEntreFrases);
    });
  };
  siguiente();
}

function cambiarSeccion(id) {
  detenerAudio();
  document.querySelectorAll('.section').forEach(seccion => seccion.classList.toggle('active', seccion.id === id));
  document.querySelectorAll('.tab').forEach(boton => {
    const seleccionado = boton.dataset.seccion === id;
    boton.classList.toggle('active', seleccionado);
    boton.setAttribute('aria-selected', String(seleccionado));
  });
}

function prepararAplicacion() {
  document.getElementById('version').textContent = `v${configuracion.version}`;
  mostrarPreguntas();
  mostrarPredicciones();
  const selectorVelocidad = document.getElementById('velocidad-audio');
  selectorVelocidad.value = String(configuracion.velocidad);
  selectorVelocidad.addEventListener('change', () => {
    velocidadActual = Number(selectorVelocidad.value);
    detenerAudio();
  });
  const botonBucle = document.getElementById('bucle-audio');
  botonBucle.addEventListener('click', () => {
    bucleActivo = !bucleActivo;
    botonBucle.setAttribute('aria-pressed', String(bucleActivo));
    botonBucle.textContent = bucleActivo ? '🔁 Bucle activado' : '🔁 Bucle desactivado';
    mostrarAvisoBucle();
  });
  document.querySelectorAll('.tab').forEach(boton => boton.addEventListener('click', () => cambiarSeccion(boton.dataset.seccion)));
  document.querySelectorAll('[data-reproducir-todo]').forEach(boton => {
    boton.dataset.textoOriginal = boton.textContent;
    boton.addEventListener('click', () => reproducirSecuencia(boton, boton.dataset.reproducirTodo));
  });
  document.getElementById('aleatoria').addEventListener('click', () => {
    cambiarSeccion('conversacion');
    const indice = Math.floor(Math.random() * preguntasOrales.length) + 1;
    document.getElementById(`pregunta-${indice}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('pagehide', detenerAudio);
}

prepararAplicacion();
