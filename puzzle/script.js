// Configuración del puzzle
const FILAS = 6;
const COLUMNAS = 6;
const TOTAL_PIEZAS = FILAS * COLUMNAS;

// Estado del juego
let piezas = [];
let juegoCompletado = false;
let piezaSeleccionada = null;

// Elementos del DOM
const tablero = document.getElementById('tablero');
const contador = document.getElementById('contador');
const totalPiezas = document.getElementById('totalPiezas');
const progreso = document.getElementById('progreso');
const mensajeVictoria = document.getElementById('mensajeVictoria');

// Inicializar
totalPiezas.textContent = TOTAL_PIEZAS;

function inicializarPuzzle() {
    piezas = Array.from({ length: TOTAL_PIEZAS }, (_, i) => i);
    revolverPiezas();
    juegoCompletado = false;
    piezaSeleccionada = null;
    mensajeVictoria.style.display = 'none';
    tablero.classList.remove('completado');
    renderizarTablero();
    actualizarContador();
}

// Revolver las piezas
function revolverPiezas() {
    for (let i = 0; i < 300; i++) {
        const a = Math.floor(Math.random() * TOTAL_PIEZAS);
        let b = Math.floor(Math.random() * TOTAL_PIEZAS);
        while (b === a) b = Math.floor(Math.random() * TOTAL_PIEZAS);
        intercambiar(a, b);
    }
    
    let resuelto = true;
    for (let i = 0; i < TOTAL_PIEZAS; i++) {
        if (piezas[i] !== i) {
            resuelto = false;
            break;
        }
    }
    if (resuelto) {
        const a = Math.floor(Math.random() * TOTAL_PIEZAS);
        let b = Math.floor(Math.random() * TOTAL_PIEZAS);
        while (b === a) b = Math.floor(Math.random() * TOTAL_PIEZAS);
        intercambiar(a, b);
    }
}

function intercambiar(pos1, pos2) {
    if (pos1 === pos2) return;
    const temp = piezas[pos1];
    piezas[pos1] = piezas[pos2];
    piezas[pos2] = temp;
}

// Renderizar tablero
function renderizarTablero() {
    tablero.innerHTML = '';
    const tamaño = 500;
    const piezaTamaño = tamaño / COLUMNAS;
    
    // Si el juego está completado, mostrar la imagen completa
    if (juegoCompletado) {
        mostrarImagenCompleta(tamaño);
        return;
    }
    
    for (let i = 0; i < TOTAL_PIEZAS; i++) {
        const celda = document.createElement('div');
        celda.className = 'celda';
        celda.dataset.index = i;
        
        const pieza = document.createElement('div');
        pieza.className = 'pieza';
        pieza.dataset.indice = piezas[i];
        
        const fila = Math.floor(piezas[i] / COLUMNAS);
        const columna = piezas[i] % COLUMNAS;
        
        pieza.style.backgroundImage = "url('puzzle.jpg')";
        pieza.style.backgroundSize = `${tamaño}px ${tamaño}px`;
        pieza.style.backgroundPosition = `-${columna * piezaTamaño}px -${fila * piezaTamaño}px`;
        
        if (piezas[i] === i) {
            pieza.classList.add('colocada');
            pieza.classList.add('correcta');
        }
        
        celda.appendChild(pieza);
        celda.classList.add('ocupada');
        celda.addEventListener('click', () => manejarClicCelda(i));
        
        tablero.appendChild(celda);
    }
    
    if (piezaSeleccionada !== null) {
        const celdas = tablero.querySelectorAll('.celda');
        celdas.forEach((celda, index) => {
            if (index === piezaSeleccionada) {
                celda.classList.add('seleccionada');
            }
        });
    }
}

// MOSTRAR IMAGEN COMPLETA - Versión corregida
function mostrarImagenCompleta(tamaño) {
    // Crear la imagen completa
    const contenedor = document.createElement('div');
    contenedor.style.width = '100%';
    contenedor.style.height = '100%';
    contenedor.style.backgroundImage = "url('puzzle.jpg')";
    contenedor.style.backgroundSize = `${tamaño}px ${tamaño}px`;
    contenedor.style.backgroundPosition = 'center';
    contenedor.style.backgroundRepeat = 'no-repeat';
    contenedor.style.borderRadius = '8px';
    contenedor.style.animation = 'aparecerImagen 0.8s ease';
    
    // Asegurar que la imagen se vea completa
    contenedor.style.position = 'relative';
    contenedor.style.overflow = 'hidden';
    
    // Agregar un efecto de brillo
    const brillo = document.createElement('div');
    brillo.style.position = 'absolute';
    brillo.style.top = '0';
    brillo.style.left = '0';
    brillo.style.width = '100%';
    brillo.style.height = '100%';
    brillo.style.background = 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%)';
    brillo.style.pointerEvents = 'none';
    contenedor.appendChild(brillo);
    
    tablero.appendChild(contenedor);
}

// Manejar clic en una celda
function manejarClicCelda(index) {
    if (juegoCompletado) return;
    
    if (piezaSeleccionada === null) {
        piezaSeleccionada = index;
        resaltarCelda(index, true);
        return;
    }
    
    if (piezaSeleccionada === index) {
        deseleccionar();
        return;
    }
    
    const origen = piezaSeleccionada;
    const destino = index;
    
    const valorOrigen = piezas[origen];
    const valorDestino = piezas[destino];
    piezas[origen] = valorDestino;
    piezas[destino] = valorOrigen;
    
    const celdas = tablero.querySelectorAll('.celda');
    celdas.forEach(celda => {
        if (celda.dataset.index == origen || celda.dataset.index == destino) {
            celda.classList.add('intercambio');
            setTimeout(() => celda.classList.remove('intercambio'), 500);
        }
    });
    
    deseleccionar();
    renderizarTablero();
    actualizarContador();
    verificarVictoria();
}

function resaltarCelda(index, activar) {
    const celdas = tablero.querySelectorAll('.celda');
    celdas.forEach(celda => {
        if (parseInt(celda.dataset.index) === index) {
            if (activar) {
                celda.classList.add('seleccionada');
            } else {
                celda.classList.remove('seleccionada');
            }
        }
    });
}

function deseleccionar() {
    if (piezaSeleccionada !== null) {
        resaltarCelda(piezaSeleccionada, false);
        piezaSeleccionada = null;
    }
}

// Contador y progreso
function actualizarContador() {
    let colocadas = 0;
    for (let i = 0; i < TOTAL_PIEZAS; i++) {
        if (piezas[i] === i) {
            colocadas++;
        }
    }
    contador.textContent = colocadas;
    const porcentaje = (colocadas / TOTAL_PIEZAS) * 100;
    progreso.style.width = `${porcentaje}%`;
    return colocadas;
}

// Verificar victoria
function verificarVictoria() {
    let completado = true;
    for (let i = 0; i < TOTAL_PIEZAS; i++) {
        if (piezas[i] !== i) {
            completado = false;
            break;
        }
    }
    
    if (completado) {
        juegoCompletado = true;
        mensajeVictoria.style.display = 'block';
        progreso.style.width = '100%';
        progreso.style.background = 'linear-gradient(90deg, #00b09b, #96c93d)';
        tablero.classList.add('completado');
        renderizarTablero(); // Esto mostrará la imagen completa
    }
}

// Reiniciar juego
function reiniciarJuego() {
    if (confirm('¿Seguro que quieres reiniciar el puzzle?')) {
        inicializarPuzzle();
        progreso.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
    }
}

// Revolver piezas
function revolverJuego() {
    if (juegoCompletado) {
        reiniciarJuego();
        return;
    }
    
    revolverPiezas();
    piezaSeleccionada = null;
    renderizarTablero();
    actualizarContador();
    mensajeVictoria.style.display = 'none';
    juegoCompletado = false;
    progreso.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
}

// Event listeners
document.getElementById('btnReiniciar').addEventListener('click', reiniciarJuego);
document.getElementById('btnRevolver').addEventListener('click', revolverJuego);

// Iniciar el juego
inicializarPuzzle();

console.log('🧩 Puzzle cargado correctamente');