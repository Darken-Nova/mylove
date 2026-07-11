// Configuración
const TOTAL_PAREJAS = 10;
const TOTAL_CARTAS = TOTAL_PAREJAS * 2; // 20 cartas
const RUTA_IMAGENES = 'imagenes/';

// Estado del juego
let cartas = [];
let cartasSeleccionadas = [];
let bloqueado = false;
let parejasEncontradas = 0;
let intentos = 0;
let tiempoInicio = null;
let timerInterval = null;
let juegoCompletado = false;

// Elementos del DOM
const tablero = document.getElementById('tablero');
const contadorIntentos = document.getElementById('intentos');
const contadorParejas = document.getElementById('parejas');
const contadorTiempo = document.getElementById('tiempo');
const barraProgreso = document.getElementById('progreso');
const modalVictoria = document.getElementById('modalVictoria');
const finalIntentos = document.getElementById('finalIntentos');
const finalTiempo = document.getElementById('finalTiempo');
const btnCerrarModal = document.getElementById('btnCerrarModal');

// Inicializar
function iniciarJuego() {
    // Reiniciar estado
    cartasSeleccionadas = [];
    bloqueado = false;
    parejasEncontradas = 0;
    intentos = 0;
    juegoCompletado = false;
    modalVictoria.classList.remove('mostrar');
    modalVictoria.style.display = 'none';
    
    // Detener timer anterior
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    tiempoInicio = null;
    contadorTiempo.textContent = '0';
    
    // Crear las cartas (10 imágenes, cada una aparece 2 veces)
    const imagenes = [];
    for (let i = 1; i <= TOTAL_PAREJAS; i++) {
        const nombre = i.toString().padStart(2, '0') + '.jpg';
        imagenes.push(nombre, nombre);
    }
    
    // Revolver las cartas
    cartas = imagenes.map((imagen, index) => ({
        id: index,
        imagen: imagen,
        volteada: false,
        coincide: false
    }));
    
    // Fisher-Yates shuffle
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    
    renderizar();
    actualizarEstadisticas();
    // Limpiar confeti
    document.getElementById('confeti-container').innerHTML = '';
}

// Renderizar tablero
function renderizar() {
    tablero.innerHTML = cartas.map((carta, index) => {
        let clases = 'carta';
        if (carta.volteada) clases += ' volteada';
        if (carta.coincide) clases += ' coincide';
        
        const rutaImagen = RUTA_IMAGENES + carta.imagen;
        
        return `
            <div class="${clases}" data-index="${index}" onclick="seleccionarCarta(${index})">
                <div class="atras"></div>
                <div class="frente" style="background-image: url('${rutaImagen}');"></div>
            </div>
        `;
    }).join('');
}

// Seleccionar una carta
function seleccionarCarta(index) {
    if (bloqueado) return;
    if (juegoCompletado) return;
    
    const carta = cartas[index];
    if (carta.volteada || carta.coincide) return;
    
    if (!tiempoInicio) {
        tiempoInicio = Date.now();
        timerInterval = setInterval(actualizarTiempo, 1000);
    }
    
    carta.volteada = true;
    cartasSeleccionadas.push(index);
    renderizar();
    
    if (cartasSeleccionadas.length === 2) {
        intentos++;
        bloqueado = true;
        actualizarEstadisticas();
        
        const idx1 = cartasSeleccionadas[0];
        const idx2 = cartasSeleccionadas[1];
        const carta1 = cartas[idx1];
        const carta2 = cartas[idx2];
        
        if (carta1.imagen === carta2.imagen) {
            carta1.coincide = true;
            carta2.coincide = true;
            parejasEncontradas++;
            
            cartasSeleccionadas = [];
            bloqueado = false;
            
            renderizar();
            actualizarEstadisticas();
            
            if (parejasEncontradas === TOTAL_PAREJAS) {
                juegoCompletado = true;
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
                // Mostrar modal con animación
                setTimeout(mostrarVictoria, 500);
            }
        } else {
            setTimeout(() => {
                carta1.volteada = false;
                carta2.volteada = false;
                cartasSeleccionadas = [];
                bloqueado = false;
                renderizar();
            }, 1000);
        }
    }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    contadorIntentos.textContent = intentos;
    contadorParejas.textContent = parejasEncontradas;
    
    const porcentaje = (parejasEncontradas / TOTAL_PAREJAS) * 100;
    barraProgreso.style.width = `${porcentaje}%`;
    
    if (parejasEncontradas === TOTAL_PAREJAS) {
        barraProgreso.style.background = 'linear-gradient(90deg, #00b09b, #96c93d)';
    }
}

// Actualizar tiempo
function actualizarTiempo() {
    if (tiempoInicio) {
        const segundos = Math.floor((Date.now() - tiempoInicio) / 1000);
        contadorTiempo.textContent = segundos;
    }
}

// ============================================
// MOSTRAR VICTORIA CON ANIMACIÓN
// ============================================
function mostrarVictoria() {
    const segundos = contadorTiempo.textContent;
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const tiempoStr = minutos > 0 
        ? `${minutos}m ${segundosRestantes}s` 
        : `${segundos}s`;
    
    // Actualizar estadísticas en el modal
    finalIntentos.textContent = intentos;
    finalTiempo.textContent = tiempoStr;
    
    // Mostrar modal
    modalVictoria.style.display = 'flex';
    // Pequeño retraso para que la animación funcione
    setTimeout(() => {
        modalVictoria.classList.add('mostrar');
    }, 50);
    
    // Generar confeti
    generarConfeti();
}

// ============================================
// GENERAR CONFETI
// ============================================
function generarConfeti() {
    const container = document.getElementById('confeti-container');
    container.innerHTML = '';
    
    const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3', '#f368e0', '#ffd93d', '#6c5ce7', '#00b894', '#e17055'];
    const formas = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 80; i++) {
        const confeti = document.createElement('div');
        confeti.className = 'confeti';
        
        const color = colores[Math.floor(Math.random() * colores.length)];
        const size = 6 + Math.random() * 10;
        const izquierda = Math.random() * 100;
        const duracion = 2 + Math.random() * 3;
        const retraso = Math.random() * 2;
        const forma = formas[Math.floor(Math.random() * formas.length)];
        
        confeti.style.left = izquierda + '%';
        confeti.style.width = size + 'px';
        confeti.style.height = size + 'px';
        confeti.style.background = color;
        confeti.style.borderRadius = forma === 'circle' ? '50%' : forma === 'square' ? '2px' : '0';
        confeti.style.animationDuration = duracion + 's';
        confeti.style.animationDelay = retraso + 's';
        
        // Para triángulos
        if (forma === 'triangle') {
            confeti.style.width = '0';
            confeti.style.height = '0';
            confeti.style.background = 'transparent';
            confeti.style.borderLeft = size/2 + 'px solid transparent';
            confeti.style.borderRight = size/2 + 'px solid transparent';
            confeti.style.borderBottom = size + 'px solid ' + color;
        }
        
        container.appendChild(confeti);
    }
    
    // Limpiar confeti después de 5 segundos
    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}

// ============================================
// CERRAR MODAL
// ============================================
function cerrarModal() {
    modalVictoria.classList.remove('mostrar');
    setTimeout(() => {
        modalVictoria.style.display = 'none';
        document.getElementById('confeti-container').innerHTML = '';
    }, 300);
    iniciarJuego();
}

// Event listeners
document.getElementById('btnReiniciar').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres reiniciar el juego?')) {
        iniciarJuego();
        barraProgreso.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
    }
});

btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar modal al hacer clic fuera
modalVictoria.addEventListener('click', (e) => {
    if (e.target === modalVictoria) {
        cerrarModal();
    }
});

// Iniciar
iniciarJuego();

console.log('💝 Juego de memoria cargado');
console.log('📷 Buscando imágenes en: ' + RUTA_IMAGENES);
console.log('🎉 Mensaje personalizado: "Felicidades mi tomatito jajaja, Dia 12 de 29"');