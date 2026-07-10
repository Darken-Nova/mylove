// Configuración del puzzle
const FILAS = 6;
const COLUMNAS = 6;
const TOTAL_PIEZAS = FILAS * COLUMNAS;

// Estado del juego
let piezas = [];
let juegoCompletado = false;
let piezaSeleccionada = null; // Índice de la pieza seleccionada

// Elementos del DOM
const tablero = document.getElementById('tablero');
const contador = document.getElementById('contador');
const totalPiezas = document.getElementById('totalPiezas');
const progreso = document.getElementById('progreso');
const mensajeVictoria = document.getElementById('mensajeVictoria');

// Inicializar
totalPiezas.textContent = TOTAL_PIEZAS;

function inicializarPuzzle() {
    // Crear array con todas las piezas (0 a 35)
    piezas = Array.from({ length: TOTAL_PIEZAS }, (_, i) => i);
    revolverPiezas();
    juegoCompletado = false;
    piezaSeleccionada = null;
    mensajeVictoria.style.display = 'none';
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
    
    // Asegurar que no esté resuelto
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

// Función para intercambiar dos posiciones
function intercambiar(pos1, pos2) {
    if (pos1 === pos2) return;
    const temp = piezas[pos1];
    piezas[pos1] = piezas[pos2];
    piezas[pos2] = temp;
}

// Renderizar tablero - TODAS las piezas visibles
function renderizarTablero() {
    tablero.innerHTML = '';
    const tamaño = 500;
    const piezaTamaño = tamaño / COLUMNAS;
    
    for (let i = 0; i < TOTAL_PIEZAS; i++) {
        const celda = document.createElement('div');
        celda.className = 'celda';
        celda.dataset.index = i;
        
        // SIEMPRE hay una pieza en cada celda (todas las posiciones están ocupadas)
        const pieza = document.createElement('div');
        pieza.className = 'pieza';
        pieza.dataset.indice = piezas[i];
        
        const fila = Math.floor(piezas[i] / COLUMNAS);
        const columna = piezas[i] % COLUMNAS;
        
        pieza.style.backgroundImage = "url('puzzle.jpg')";
        pieza.style.backgroundSize = `${tamaño}px ${tamaño}px`;
        pieza.style.backgroundPosition = `-${columna * piezaTamaño}px -${fila * piezaTamaño}px`;
        
        // Marcar si está en su posición correcta
        if (piezas[i] === i) {
            pieza.classList.add('colocada');
            pieza.classList.add('correcta');
        }
        
        celda.appendChild(pieza);
        celda.classList.add('ocupada');
        
        // Evento clic para seleccionar e intercambiar
        celda.addEventListener('click', () => manejarClicCelda(i));
        
        tablero.appendChild(celda);
    }
    
    // Actualizar selección visual
    if (piezaSeleccionada !== null) {
        const celdas = tablero.querySelectorAll('.celda');
        celdas.forEach((celda, index) => {
            if (index === piezaSeleccionada) {
                celda.classList.add('seleccionada');
            }
        });
    }
}

// Manejar clic en una celda
function manejarClicCelda(index) {
    if (juegoCompletado) return;
    
    // Si no hay pieza seleccionada, seleccionar esta
    if (piezaSeleccionada === null) {
        piezaSeleccionada = index;
        resaltarCelda(index, true);
        return;
    }
    
    // Si ya hay una pieza seleccionada
    if (piezaSeleccionada === index) {
        // Si es la misma, deseleccionar
        deseleccionar();
        return;
    }
    
    // INTERCAMBIAR las dos piezas
    const origen = piezaSeleccionada;
    const destino = index;
    
    // Intercambiar en el array
    const valorOrigen = piezas[origen];
    const valorDestino = piezas[destino];
    piezas[origen] = valorDestino;
    piezas[destino] = valorOrigen;
    
    // Animación
    const celdas = tablero.querySelectorAll('.celda');
    celdas.forEach(celda => {
        if (celda.dataset.index == origen || celda.dataset.index == destino) {
            celda.classList.add('intercambio');
            setTimeout(() => celda.classList.remove('intercambio'), 500);
        }
    });
    
    // Deseleccionar
    deseleccionar();
    
    // Actualizar vista
    renderizarTablero();
    actualizarContador();
    verificarVictoria();
}

// Funciones de selección
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
        renderizarTablero();
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

console.log('🧩 Puzzle de intercambio cargado correctamente');
console.log('📝 Todas las piezas están visibles en el tablero');
console.log('📝 Haz clic en una pieza y luego en otra para intercambiarlas');