// Firebase Config (same project, different DB nodes)
const firebaseConfig = {
    apiKey: "AIzaSyCys_vb7penAxx0vYZxa8UKZLVbIKCNMS0",
    authDomain: "claseieu.firebaseapp.com",
    projectId: "claseieu",
    storageBucket: "claseieu.firebasestorage.app",
    messagingSenderId: "1061581896742",
    appId: "1:1061581896742:web:8e33255a37409a64407ae7"
};

const app = firebase.initializeApp(firebaseConfig, "tech-exam");
const db = firebase.database(app);

// --- PREGUNTAS: FUNDAMENTOS DIGITALES ---
const questions = [
    {
        q: "¿Cuántos bits tiene 1 byte?",
        options: ["4 bits", "2 bits", "8 bits", "16 bits"],
        correct: 2,
        explanation: "💡 Un byte = 8 bits. El bit (0 o 1) es la unidad mínima; 8 de ellos forman un byte, que puede representar 256 valores distintos."
    },
    {
        q: "¿Cuál es la unidad MÍNIMA de información en una computadora?",
        options: ["Byte", "Kilobyte", "Pixel", "Bit"],
        correct: 3,
        explanation: "💡 El bit (binary digit) solo puede valer 0 o 1. Es el átomo de la información digital. Todo lo demás — texto, imágenes, video — son millones de bits."
    },
    {
        q: "¿Qué hace el procesador (CPU) de una computadora?",
        options: ["Almacena archivos permanentemente", "Muestra imágenes en pantalla", "Ejecuta instrucciones y realiza cálculos", "Conecta la computadora a internet"],
        correct: 2,
        explanation: "💡 La CPU (Unidad Central de Procesamiento) es el cerebro: lee instrucciones, las ejecuta y controla el resto del hardware. Sin CPU, nada funciona."
    },
    {
        q: "¿Para qué sirve la RAM en una computadora?",
        options: ["Guardar archivos de forma permanente", "Almacenar TEMPORALMENTE los datos que están en uso", "Procesar gráficos 3D", "Conectar dispositivos externos"],
        correct: 1,
        explanation: "💡 La RAM (Memoria de Acceso Aleatorio) es la mesa de trabajo: guarda lo que está activo ahora. Al apagar, se borra. Más RAM = más programas abiertos a la vez."
    },
    {
        q: "¿Cuál de estos es un Sistema Operativo?",
        options: ["Google Chrome", "Microsoft Word", "Photoshop", "macOS"],
        correct: 3,
        explanation: "💡 macOS (Apple), Windows y Linux son Sistemas Operativos. Chrome, Word y Photoshop son aplicaciones que corren ENCIMA del SO."
    },
    {
        q: "¿Cuál es la función principal de un Sistema Operativo?",
        options: ["Navegar por internet", "Editar documentos de texto", "Administrar el hardware y permitir que corran los programas", "Diseñar páginas web"],
        correct: 2,
        explanation: "💡 El SO es el intermediario entre el hardware (CPU, RAM, disco) y las aplicaciones. Sin él, ningún programa podría usar la computadora."
    },
    {
        q: "¿Qué comando en Linux/macOS muestra el contenido de una carpeta?",
        options: ["dir", "show", "list", "ls"],
        correct: 3,
        explanation: "💡 'ls' (list) muestra los archivos y carpetas del directorio actual. En Windows el equivalente es 'dir'. Es el comando más básico de la terminal."
    },
    {
        q: "¿Qué hace el comando 'cd' en la terminal?",
        options: ["Copia un archivo", "Cierra la terminal", "Cambia de directorio (carpeta)", "Crea un nuevo archivo"],
        correct: 2,
        explanation: "💡 'cd' = Change Directory. Te mueves entre carpetas: 'cd Documentos' entra a Documentos, 'cd ..' sube un nivel. Es como hacer doble clic en una carpeta."
    },
    {
        q: "¿Para qué sirve el comando 'mkdir' en la terminal?",
        options: ["Mover un archivo a otra carpeta", "Eliminar una carpeta", "Mostrar en qué carpeta estás", "Crear una nueva carpeta"],
        correct: 3,
        explanation: "💡 'mkdir' = Make Directory. Crea una carpeta nueva. Ejemplo: 'mkdir mi-proyecto' crea la carpeta 'mi-proyecto' en el lugar donde estás."
    },
    {
        q: "En inteligencia artificial, ¿qué es un 'prompt'?",
        options: ["Un tipo de lenguaje de programación", "El chip que procesa la IA", "Una instrucción o texto que le das a la IA para obtener una respuesta", "Una ventana de la terminal"],
        correct: 2,
        explanation: "💡 El prompt es tu instrucción a la IA. La calidad del prompt determina la calidad de la respuesta. 'Prompt engineering' es el arte de redactar buenos prompts."
    },
    {
        q: "¿Qué es el 'Vibe Coding'?",
        options: ["Programar mientras escuchas música", "Diseñar interfaces con colores vibrantes", "Crear aplicaciones usando prompts de lenguaje natural con ayuda de IA", "Codificar en equipo en tiempo real"],
        correct: 2,
        explanation: "💡 Vibe Coding = describir lo que quieres en lenguaje humano y dejar que la IA genere el código. Herramientas como Cursor, Replit o Claude Code lo hacen posible."
    },
    {
        q: "¿Qué es una API?",
        options: ["Un tipo de base de datos relacional", "Un programa para diseñar páginas web", "Un servidor físico en la nube", "Una interfaz que permite que dos aplicaciones se comuniquen entre sí"],
        correct: 3,
        explanation: "💡 API = Application Programming Interface. Es el 'mesero' entre apps: tu app pide datos (pide el menú), la API va al servidor (cocina) y trae la respuesta."
    },
    {
        q: "¿Qué describe la 'arquitectura de software'?",
        options: ["El diseño visual y colores de una app", "El lenguaje de programación elegido", "La estructura y organización general de los componentes de un sistema", "El número de usuarios que puede atender"],
        correct: 2,
        explanation: "💡 La arquitectura define cómo se dividen y conectan las partes de un sistema (frontend, backend, base de datos, APIs). Es el plano antes de construir."
    },
    {
        q: "¿Cómo funciona internet en términos básicos?",
        options: ["Una señal de radio que cubre todo el planeta", "Un satélite que transmite información a todos", "Un disco duro gigante compartido globalmente", "Una red global de computadoras interconectadas que intercambian datos"],
        correct: 3,
        explanation: "💡 Internet es millones de computadoras conectadas por cables y señales inalámbricas, usando protocolos (reglas) como TCP/IP para enviarse paquetes de datos."
    },
    {
        q: "¿Cómo se organizan los archivos en un sistema operativo?",
        options: ["En tablas de bases de datos", "En listas alfabéticas planas sin jerarquía", "En bloques de memoria sin ningún orden", "En una estructura jerárquica de carpetas (directorios)"],
        correct: 3,
        explanation: "💡 Los archivos se organizan en árbol: hay una raíz (/ en Linux/Mac, C:\\ en Windows) y dentro van carpetas con subcarpetas. Igual que un archivero físico."
    },
    {
        q: "¿Qué es un SoC (System on a Chip)?",
        options: ["Un software para gestionar múltiples chips", "Un protocolo de red para microchips", "Un sistema de almacenamiento en la nube", "Un chip que integra CPU, GPU, RAM y más componentes en un solo circuito"],
        correct: 3,
        explanation: "💡 Los SoC son la razón por la que los iPhones y chips M de Apple son tan eficientes: todo (CPU, GPU, memoria, neural engine) en un solo chip compacto."
    },
    {
        q: "¿Para qué se utilizan principalmente las GPUs hoy en día?",
        options: ["Para procesar señales de audio", "Para gestionar conexiones de red", "Para almacenar grandes cantidades de datos", "Para renderizar gráficos y procesamiento paralelo masivo (incluyendo IA)"],
        correct: 3,
        explanation: "💡 Las GPUs nacieron para videojuegos, pero ahora entrenan modelos de IA como ChatGPT. Su capacidad de hacer miles de operaciones en paralelo las hace perfectas para eso."
    },
    {
        q: "¿Qué es un lenguaje de programación?",
        options: ["El idioma en que están escritos los manuales de software", "El lenguaje que usa la IA para comunicarse con humanos", "Un protocolo de comunicación entre servidores", "Un conjunto de instrucciones y reglas para decirle a una computadora qué hacer"],
        correct: 3,
        explanation: "💡 Lenguajes como Python, JavaScript o Swift son intermediarios entre el humano y la máquina. El programador escribe instrucciones; la computadora las ejecuta."
    },
    {
        q: "¿Qué hace HTML en una página web?",
        options: ["Da estilos visuales (colores, fuentes)", "Añade interactividad y lógica", "Conecta con la base de datos", "Define la estructura y el contenido de la página"],
        correct: 3,
        explanation: "💡 HTML (HyperText Markup Language) es el esqueleto: titulos, párrafos, imágenes, botones. Sin HTML no hay estructura. CSS pone la ropa, JS pone el cerebro."
    },
    {
        q: "¿Qué hace CSS en una página web?",
        options: ["Almacena datos del usuario", "Define la estructura del documento", "Controla la apariencia visual: colores, fuentes, tamaños y diseño", "Procesa la lógica del servidor"],
        correct: 2,
        explanation: "💡 CSS (Cascading Style Sheets) es el estilista. Toma la estructura HTML y le aplica colores, tipografías, espaciados y animaciones para que se vea bien."
    },
    {
        q: "¿Para qué sirve JavaScript en el navegador?",
        options: ["Para estructurar el contenido HTML", "Para aplicar estilos visuales", "Para gestionar bases de datos directamente", "Para agregar interactividad y lógica: clicks, animaciones, formularios"],
        correct: 3,
        explanation: "💡 JavaScript es el motor: hace que los botones respondan, valida formularios, carga datos sin recargar la página. Sin JS, la web sería solo documentos estáticos."
    },
    {
        q: "¿Qué es una base de datos?",
        options: ["Una carpeta con muchos archivos organizados", "Un tipo de servidor web especial", "Un lenguaje de programación para datos", "Un sistema organizado para almacenar, gestionar y consultar información de forma eficiente"],
        correct: 3,
        explanation: "💡 Las bases de datos (MySQL, PostgreSQL, Firebase) permiten guardar millones de registros y consultarlos en milisegundos. Son la memoria de casi toda aplicación."
    }
];

// --- STATE ---
let myPlayerId = localStorage.getItem('ieu_playerIdTech');
let myName = localStorage.getItem('ieu_playerNameTech');
let isAdmin = false;
let currentQIdx = 0;

const screens = {
    login: document.getElementById('screen-login'),
    lobby: document.getElementById('screen-lobby'),
    game: document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
    final: document.getElementById('screen-final')
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
        enableAdminMode();
    }

    if (myName && !isAdmin) {
        document.getElementById('playerName').value = myName;
    }

    db.ref('gameState_tech').on('value', (snapshot) => {
        const state = snapshot.val() || { phase: 'lobby', questionIdx: 0 };
        syncInterface(state);
    });
});

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- PLAYER ---
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('playerName').value.trim();
    if (!nameInput) return;

    if (!myPlayerId) {
        myPlayerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        localStorage.setItem('ieu_playerIdTech', myPlayerId);
    }
    myName = nameInput;
    localStorage.setItem('ieu_playerNameTech', myName);

    db.ref(`players_tech/${myPlayerId}`).set({
        name: myName,
        score: 0,
        lastAnswer: -1,
        online: true
    });

    showScreen('lobby');
});

function submitAnswer(optionIdx) {
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.idx == optionIdx) b.classList.add('selected');
    });

    document.getElementById('feedback-msg').textContent = "Respuesta enviada...";
    playSound('click');

    db.ref(`players_tech/${myPlayerId}/lastAnswer`).set(optionIdx);
    db.ref(`players_tech/${myPlayerId}/answers/${currentQIdx}`).set(optionIdx);
}

// --- SYNC ---
function syncInterface(state) {
    const { phase, questionIdx, reveal } = state;
    currentQIdx = questionIdx;

    if (isAdmin) {
        document.getElementById('admin-controls').style.display = 'flex';
    }

    if (phase === 'lobby') {
        if (!myPlayerId && !isAdmin) {
            showScreen('login');
            return;
        }

        showScreen('lobby');

        if (isAdmin) {
            generateQRCode();
        }

        db.ref('players_tech').on('value', (snap) => {
            const count = snap.numChildren();
            document.getElementById('lobby-count').textContent = count;

            if (isAdmin) {
                const list = document.getElementById('admin-player-list');
                list.style.display = 'flex';
                list.innerHTML = '';
                snap.forEach(child => {
                    const p = child.val();
                    list.innerHTML += `<span class="player-badge">${p.name}</span>`;
                });
            }
        });
    }
    else if (phase === 'game' || phase === 'question') {
        showScreen('game');
        renderQuestion(questionIdx);

        if (isAdmin) {
            const btns = document.querySelectorAll('.option-btn');
            btns.forEach(b => {
                b.style.pointerEvents = 'none';
                b.style.cursor = 'default';
            });
            document.getElementById('feedback-msg').textContent = "Proyectando pregunta...";
        }

        if (reveal) {
            showReveal(questionIdx);
        } else {
            const btns = document.querySelectorAll('.option-btn');
            btns.forEach(b => {
                b.classList.remove('disabled');
                b.style.opacity = "1";
                b.innerHTML = questions[questionIdx].options[b.dataset.idx];
                if (isAdmin) b.style.pointerEvents = 'none';
            });
            document.getElementById('correct-answer-reveal').style.display = 'none';
        }
    }
    else if (phase === 'results') {
        showScreen('results');
        renderChart(questionIdx);

        const revealBox = document.getElementById('correct-answer-reveal');
        revealBox.style.display = 'block';
        revealBox.classList.remove('hidden');

        const q = questions[questionIdx];
        document.getElementById('correct-text').innerHTML = `
            <div style="font-size: 1.4rem; margin-bottom: 1rem;">✅ ${q.options[q.correct]}</div>
            <div style="font-size: 1.1rem; color: #444; font-weight: normal; padding: 15px; background: #FFF9C4; border-left: 5px solid #FBC02D; border-radius: 8px; text-align: left;">
                ${q.explanation}
            </div>
        `;

        renderPartialLeaderboard();
    }
    else if (phase === 'final') {
        showScreen('final');
        renderPodium();

        if (!isAdmin && myPlayerId) {
            renderMyResults();
        }

        if (isAdmin) {
            renderAdminResultsTable();
        }
    }
}

// --- QR CODE ---
let qrGenerated = false;
function generateQRCode() {
    if (qrGenerated) return;
    qrGenerated = true;

    const qrSection = document.getElementById('admin-qr-section');
    qrSection.style.display = 'block';

    const studentUrl = window.location.href.replace(/[?&]?admin[^&]*/g, '').replace(/[?&]$/, '');
    document.getElementById('student-url-text').textContent = studentUrl;

    new QRCode(document.getElementById('qr-code'), {
        text: studentUrl,
        width: 220,
        height: 220,
        colorDark: '#1D1D1D',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// --- ADMIN ---
function enableAdminMode() {
    isAdmin = true;
    document.body.classList.add('admin-mode');
    showScreen('lobby');
    document.getElementById('admin-controls').style.display = 'flex';

    db.ref('gameState_tech').once('value', s => {
        if (!s.exists()) adminResetGame(true);
    });
}

function adminResetGame(silent = false) {
    if (!silent && !confirm("⚠️ ¿REINICIAR TODO? Se borrarán todos los jugadores y puntos.")) return;

    db.ref('players_tech').remove();
    db.ref('gameState_tech').set({ phase: 'lobby', questionIdx: 0, reveal: false });
    qrGenerated = false;
    document.getElementById('qr-code').innerHTML = '';

    if (!silent) alert("Juego Reiniciado. Pide a los alumnos que recarguen su página.");
}

function adminNextPhase() {
    db.ref('gameState_tech').once('value', snap => {
        let state = snap.val();
        let { phase, questionIdx, reveal } = state;

        if (phase === 'lobby') {
            db.ref('gameState_tech').update({ phase: 'question', questionIdx: 0, reveal: false });
        }
        else if (phase === 'question') {
            if (!reveal) {
                db.ref('gameState_tech').update({ reveal: true });
                calculateScores(questionIdx);
            } else {
                db.ref('gameState_tech').update({ phase: 'results' });
            }
        }
        else if (phase === 'results') {
            const nextIdx = questionIdx + 1;
            if (nextIdx < questions.length) {
                db.ref('players_tech').once('value', ps => {
                    ps.forEach(p => p.ref.update({ lastAnswer: -1 }));
                });
                db.ref('gameState_tech').update({ phase: 'question', questionIdx: nextIdx, reveal: false });
            } else {
                saveGameHistory();
                db.ref('gameState_tech').update({ phase: 'final' });
            }
        }
    });
}

function calculateScores(qIdx) {
    const correctOpt = questions[qIdx].correct;
    db.ref('players_tech').once('value', snap => {
        snap.forEach(playerSnap => {
            const p = playerSnap.val();
            if (p.lastAnswer === correctOpt) {
                playerSnap.ref.update({ score: (p.score || 0) + 100 });
            }
        });
    });
}

// --- RENDER ---
function renderQuestion(idx) {
    const q = questions[idx];
    document.getElementById('q-counter').textContent = `${idx + 1} / ${questions.length}`;
    document.getElementById('q-text').textContent = q.q;
    const cont = document.getElementById('options-container');

    if (cont.dataset.currentQ != idx) {
        cont.dataset.currentQ = idx;
        cont.innerHTML = '';
        document.getElementById('feedback-msg').textContent = "";

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = `option-btn opt-${i}`;
            btn.dataset.idx = i;
            btn.innerHTML = opt;
            btn.onclick = () => submitAnswer(i);
            cont.appendChild(btn);
        });
    }
}

function showReveal(idx) {
    const q = questions[idx];
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.idx == q.correct) {
            b.style.border = "4px solid white";
            b.style.transform = "scale(1.1)";
            b.innerHTML += " ✅";
        } else {
            b.style.opacity = "0.3";
        }
    });

    if (!isAdmin) {
        db.ref(`players_tech/${myPlayerId}/lastAnswer`).once('value', s => {
            const myAns = s.val();
            const msg = document.getElementById('feedback-msg');
            if (myAns === q.correct) {
                msg.textContent = "¡CORRECTO! +100 puntos 🎉";
                msg.style.color = "#4CAF50";
                playSound('cheer');
            } else {
                msg.textContent = "Incorrecto 😢";
                msg.style.color = "#F44336";
            }
        });
    } else {
        const msg = document.getElementById('feedback-msg');
        msg.textContent = "";
        msg.style.display = 'none';
        playSound('cheer');
    }
}

function renderPartialLeaderboard() {
    let partialContainer = document.getElementById('partial-leaderboard');
    if (!partialContainer) {
        partialContainer = document.createElement('div');
        partialContainer.id = 'partial-leaderboard';
        partialContainer.style.marginTop = "2rem";
        partialContainer.style.width = "100%";
        document.getElementById('screen-results').appendChild(partialContainer);
    }

    partialContainer.innerHTML = '<h3 style="color:#aaa; font-size:1.1rem; margin-bottom:1rem;">🏆 Top 5 Parcial</h3>';

    db.ref('players_tech').orderByChild('score').limitToLast(5).once('value', snap => {
        const sorted = [];
        snap.forEach(c => sorted.push(c.val()));
        sorted.reverse();

        sorted.forEach((p, i) => {
            const row = document.createElement('div');
            row.style.cssText = "background:white;color:#333;padding:10px 15px;margin:5px 0;border-radius:50px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.1);";
            row.innerHTML = `
                <span>${i + 1}. ${p.name}</span>
                <span style="background:var(--ieu-orange);color:white;padding:2px 10px;border-radius:10px;">${p.score} pts</span>
            `;
            partialContainer.appendChild(row);
        });
    });
}

function renderChart(qIdx) {
    const container = document.getElementById('chart-container');
    container.innerHTML = '';

    const counts = [0, 0, 0, 0];
    db.ref('players_tech').once('value', snap => {
        snap.forEach(p => {
            const ans = p.val().lastAnswer;
            if (ans >= 0 && ans < 4) counts[ans]++;
        });

        const max = Math.max(...counts, 1);
        const colors = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];

        counts.forEach((val, i) => {
            const height = (val / max) * 100;
            const col = document.createElement('div');
            col.className = 'bar-col';
            col.innerHTML = `
                <div class="bar-val">${val}</div>
                <div class="bar" style="height: ${height}%; background: ${colors[i]};"></div>
                <div style="margin-top:5px;font-weight:bold;font-size:1.2rem;">${String.fromCharCode(65 + i)}</div>
            `;
            container.appendChild(col);
        });
    });
}

function renderPodium() {
    const pod = document.getElementById('podium-container');
    pod.innerHTML = '<p style="opacity:0.5;font-size:0.9rem;">Cargando ranking...</p>';

    db.ref('players_tech').orderByChild('score').once('value', snap => {
        const sorted = [];
        snap.forEach(c => sorted.push(c.val()));
        sorted.reverse();

        pod.innerHTML = '';
        const medals = ['🥇', '🥈', '🥉'];

        sorted.forEach((p, i) => {
            const row = document.createElement('div');
            const medal = medals[i] ?? `${i + 1}.`;
            const bg = i === 0 ? '#FFD700' : (i === 1 ? '#C0C0C0' : (i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.08)'));
            const color = i < 3 ? '#000' : '#fff';
            const isMe = p.name === myName;

            row.style.cssText = `background:${bg};color:${color};padding:12px 16px;margin:5px 0;border-radius:12px;display:flex;justify-content:space-between;align-items:center;font-size:1.05rem;font-weight:bold;${isMe ? 'outline:3px solid var(--ieu-orange);' : ''}`;
            row.innerHTML = `
                <span>${medal} ${p.name}${isMe ? ' 👈' : ''}</span>
                <span style="background:var(--ieu-orange);color:white;padding:3px 12px;border-radius:10px;">${p.score} pts</span>
            `;
            pod.appendChild(row);
        });
    });
}

function renderMyResults() {
    if (!myPlayerId) return;
    const container = document.getElementById('my-results-container');
    if (!container) return;

    db.ref(`players_tech/${myPlayerId}`).once('value', snap => {
        const player = snap.val();
        if (!player) return;

        const answers = player.answers || {};
        let correctCount = 0;

        let rows = '';
        questions.forEach((q, idx) => {
            const myAns = answers[idx];
            const answered = myAns !== undefined;
            const isCorrect = answered && myAns === q.correct;
            if (isCorrect) correctCount++;

            const icon = !answered ? '—' : (isCorrect ? '✅' : '❌');
            const bg = !answered ? 'rgba(255,255,255,0.05)' : (isCorrect ? 'rgba(0,200,100,0.15)' : 'rgba(220,50,50,0.15)');
            const label = !answered ? 'Sin respuesta' : (isCorrect ? 'Correcto' : `Incorrecto · Correcta: ${q.options[q.correct]}`);

            rows += `
                <div style="background:${bg};padding:10px 14px;border-radius:10px;margin-bottom:6px;display:flex;gap:12px;align-items:flex-start;">
                    <span style="font-size:1.2rem;flex-shrink:0;">${icon}</span>
                    <div>
                        <div style="font-size:0.9rem;font-weight:bold;opacity:0.9;">P${idx + 1}: ${q.q}</div>
                        <div style="font-size:0.78rem;opacity:0.65;margin-top:2px;">${label}</div>
                    </div>
                </div>`;
        });

        const pct = Math.round((correctCount / questions.length) * 100);
        const emoji = pct >= 80 ? '🌟' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '📚';

        container.innerHTML = `
            <div style="background:rgba(255,255,255,0.06);border-radius:18px;padding:1.4rem;margin-top:1.8rem;width:100%;box-sizing:border-box;">
                <div style="text-align:center;margin-bottom:1.2rem;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,0.1);">
                    <div style="font-size:2.5rem;">${emoji}</div>
                    <h3 style="margin:0.3rem 0;color:var(--ieu-orange);">${player.name}</h3>
                    <div style="font-size:2.2rem;font-weight:bold;margin:0.4rem 0;">${correctCount} / ${questions.length}</div>
                    <div style="font-size:0.9rem;opacity:0.65;">${pct}% de aciertos · ${player.score} puntos</div>
                </div>
                <h4 style="margin:0 0 0.8rem;opacity:0.7;font-size:0.85rem;text-transform:uppercase;letter-spacing:1px;">Detalle por pregunta</h4>
                ${rows}
            </div>
        `;
    });
}

function renderAdminResultsTable() {
    let tableContainer = document.getElementById('admin-results-table');
    if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.id = 'admin-results-table';
        tableContainer.style.cssText = "margin-top:3rem;background:white;padding:20px;border-radius:15px;overflow-x:auto;";
        document.getElementById('screen-final').appendChild(tableContainer);
    }

    tableContainer.innerHTML = '<h3 style="color:#333;">📊 Tabla Detallada de Resultados</h3><p style="color:#666;">Cargando...</p>';

    db.ref('players_tech').once('value', snap => {
        let html = `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;color:#333;">
            <thead><tr style="background:var(--ieu-orange);color:white;text-align:left;">
            <th style="padding:10px;">Alumno</th><th style="padding:10px;">Pts</th>`;

        questions.forEach((q, i) => {
            html += `<th style="padding:8px;text-align:center;">P${i + 1}</th>`;
        });

        html += '</tr></thead><tbody>';

        const players = [];
        snap.forEach(p => players.push(p.val()));
        players.sort((a, b) => b.score - a.score);

        players.forEach((p, index) => {
            html += `<tr style="background:${index % 2 === 0 ? '#f9f9f9' : '#fff'};border-bottom:1px solid #eee;">
                <td style="padding:10px;font-weight:bold;">${p.name}</td>
                <td style="padding:10px;">${p.score}</td>`;

            questions.forEach((q, qIdx) => {
                let cell = '-', bg = '#eee';
                if (p.answers && p.answers[qIdx] !== undefined) {
                    cell = p.answers[qIdx] === q.correct ? '✅' : '❌';
                    bg = p.answers[qIdx] === q.correct ? '#e8f5e9' : '#ffebee';
                }
                html += `<td style="padding:8px;text-align:center;background:${bg};">${cell}</td>`;
            });

            html += '</tr>';
        });

        html += '</tbody></table>';
        tableContainer.innerHTML = html;
    });
}

function saveGameHistory() {
    db.ref('players_tech').once('value', snap => {
        const playersData = snap.val();
        if (!playersData) return;

        db.ref('history_tech/sessions').push({
            timestamp: Date.now(),
            date: new Date().toISOString(),
            totalQuestions: questions.length,
            players: playersData
        });
    });
}

function downloadHistoryCSV() {
    db.ref('history_tech/sessions').once('value', snap => {
        const history = snap.val();
        if (!history) { alert("No hay historial disponible."); return; }

        let csv = "Fecha,Hora,Alumno,Puntaje,Preguntas Totales,Aciertos\n";
        Object.values(history).forEach(session => {
            const date = new Date(session.timestamp).toLocaleDateString();
            const time = new Date(session.timestamp).toLocaleTimeString();
            if (session.players) {
                Object.values(session.players).forEach(p => {
                    csv += `${date},${time},"${p.name}",${p.score},${session.totalQuestions || 0},${p.score / 100}\n`;
                });
            }
        });

        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })));
        link.setAttribute("download", "historial_tech_ieu.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// --- AUDIO ---
const sounds = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    cheer: new Audio('https://assets.mixkit.co/active_storage/sfx/95/95-preview.mp3'),
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play().catch(() => {});
    }
}

// Auto-logout si el jugador fue borrado (reset)
if (localStorage.getItem('ieu_playerNameTech') && myPlayerId) {
    db.ref(`players_tech/${myPlayerId}`).once('value', s => {
        if (!s.exists()) {
            localStorage.removeItem('ieu_playerNameTech');
            localStorage.removeItem('ieu_playerIdTech');
            location.reload();
        }
    });
}
