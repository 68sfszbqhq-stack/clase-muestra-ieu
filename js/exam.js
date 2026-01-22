// Firebase Configuration (User Provided)
const firebaseConfig = {
    apiKey: "AIzaSyCys_vb7penAxx0vYZxa8UKZLVbIKCNMS0",
    authDomain: "claseieu.firebaseapp.com",
    projectId: "claseieu",
    storageBucket: "claseieu.firebasestorage.app",
    messagingSenderId: "1061581896742",
    appId: "1:1061581896742:web:8e33255a37409a64407ae7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- GAME DATA ---
const questions = [
    {
        q: "En Microsoft Word, ¿cuál es la función principal de la pestaña 'Referencias' al redactar un trabajo académico?",
        options: ["Revisar la ortografía y gramática del contenido", "Insertar citas en el texto y generar automáticamente la bibliografía", "Cambiar el diseño de página y los márgenes del documento"],
        correct: 1,
        explanation: "💡 POR QUÉ: La pestaña Referencias permite administrar fuentes, insertar citas (APA, etc.) y generar la bibliografía automáticamente, fundamental para trabajos académicos."
    },
    {
        q: "Si deseas obtener tu Acta de Nacimiento certificada de forma digital en México, ¿a qué portal oficial debes acudir?",
        options: ["www.gob.mx", "www.ine.org.mx", "Página oficial de Facebook del Registro Civil"],
        correct: 0,
        explanation: "💡 POR QUÉ: Es el portal único del Gobierno de México que centraliza trámites como actas de nacimiento y CURP."
    },
    {
        q: "¿Cuál es la función del portal 'SIGED' en el contexto de los servicios de educación en México?",
        options: ["Consultar información del sistema educativo, como certificados y boletas", "Agendar citas para servicios de salud", "Pagar impuestos federales"],
        correct: 0,
        explanation: "💡 POR QUÉ: El Sistema de Información y Gestión Educativa (SIGED) permite consultar registros escolares oficiales y documentos académicos."
    },
    {
        q: "Al extraviar o sufrir el robo de un dispositivo móvil, ¿cuál debería ser el primer paso para proteger tu identidad digital?",
        options: ["Esperar a que alguien lo devuelva antes de cambiar contraseñas", "Comprar un dispositivo nuevo inmediatamente", "Utilizar herramientas de rastreo remoto para bloquearlo o borrarlo"],
        correct: 2,
        explanation: "💡 POR QUÉ: Es crucial bloquear el acceso a tus datos personales lo antes posible (usando 'Encontrar mi dispositivo' o similar) para evitar robo de identidad."
    },
    {
        q: "¿Por qué es fundamental reportar el IMEI de un teléfono robado a tu operadora telefónica?",
        options: ["Para mejorar la señal de internet de tu casa", "Para inhabilitar el dispositivo y que no pueda ser usado en ninguna red móvil", "Para que la operadora te regale un equipo nuevo"],
        correct: 1,
        explanation: "💡 POR QUÉ: El reporte de IMEI coloca el equipo en una lista negra global, impidiendo su uso telefónico (llamadas y datos) en la mayoría de operadoras."
    },
    {
        q: "En el desarrollo de una página web, ¿cuál es el propósito principal del lenguaje HTML?",
        options: ["Crear animaciones complejas y funciones lógicas", "Darle colores, fuentes y estilos visuales a la página", "Definir la estructura y el contenido de la página"],
        correct: 2,
        explanation: "💡 POR QUÉ: HTML es el esqueleto que organiza los elementos de información (títulos, párrafos, imágenes) en la web."
    },
    {
        q: "¿Cuál es la función del lenguaje CSS en un sitio web?",
        options: ["Almacenar los datos de los usuarios en una base de datos", "Controlar la apariencia visual y el diseño de los elementos", "Establecer la conexión a internet de la página"],
        correct: 1,
        explanation: "💡 POR QUÉ: CSS (Hojas de Estilo en Cascada) es el lenguaje responsable de dar estilo, color, tipografía y diseño a la estructura base creada con HTML."
    },
    {
        q: "¿Qué lenguaje se encarga de la interactividad y el comportamiento dinámico (como validación de formularios) en el navegador?",
        options: ["Word", "HTML", "JavaScript (JS)"],
        correct: 2,
        explanation: "💡 POR QUÉ: JavaScript es el motor que permite que las páginas web 'hagan cosas', agregando lógica, interactividad y dinamismo."
    },
    {
        q: "¿Cuál de las siguientes es una buena práctica para proteger tu identidad digital en servicios de salud o gobierno?",
        options: ["Activar la verificación en dos pasos (2FA) siempre que esté disponible", "Usar la misma contraseña en todos los portales para no confundirte", "Compartir tu contraseña con familiares cercanos por si se te olvida"],
        correct: 0,
        explanation: "💡 POR QUÉ: La verificación en dos pasos añade una capa extra de seguridad crucial, protegiendo tu cuenta incluso si alguien obtiene tu contraseña."
    }
];

// --- STATE MANAGMENT ---
let myPlayerId = localStorage.getItem('ieu_playerId');
let myName = localStorage.getItem('ieu_playerName');
let isAdmin = false;
let currentQIdx = 0; // Track current question for history

// DOM Elements
const screens = {
    login: document.getElementById('screen-login'),
    lobby: document.getElementById('screen-lobby'),
    game: document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
    final: document.getElementById('screen-final')
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Check URL for admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
        enableAdminMode();
    }

    // Auto-fill name if exists, but DO NOT auto-join to allow name correction
    if (myName && !isAdmin) {
        document.getElementById('playerName').value = myName;
    }

    // LISTENER GLOBAL DE ESTADO DE JUEGO
    db.ref('gameState').on('value', (snapshot) => {
        const state = snapshot.val() || { phase: 'login', questionIdx: 0 };
        syncInterface(state);
    });
});

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// --- PLAYER ACTIONS ---

document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('playerName').value.trim();
    if (!nameInput) return;

    if (!myPlayerId) {
        myPlayerId = 'player_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        localStorage.setItem('ieu_playerId', myPlayerId);
    }
    myName = nameInput;
    localStorage.setItem('ieu_playerName', myName);

    // Register in Firebase
    db.ref(`players/${myPlayerId}`).set({
        name: myName,
        score: 0,
        lastAnswer: -1,
        online: true
    });

    // Handle disconnect
    db.ref(`players/${myPlayerId}`).onDisconnect().remove();

    showScreen('lobby');
});

function submitAnswer(optionIdx) {
    // UI Feedback
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.idx == optionIdx) b.classList.add('selected');
    });

    document.getElementById('feedback-msg').textContent = "Respuesta enviada...";
    playSound('click');

    // Send to Firebase
    db.ref(`players/${myPlayerId}/lastAnswer`).set(optionIdx);

    // GUARDAR HISTORIAL DE RESPUESTAS para la tabla final
    db.ref(`players/${myPlayerId}/answers/${currentQIdx}`).set(optionIdx);
}

// --- SYNC LOGIC (CORE) ---

function syncInterface(state) {
    const { phase, questionIdx, reveal } = state;
    currentQIdx = questionIdx; // Update global tracker

    // Admin UI always shows controls
    if (isAdmin) {
        document.getElementById('admin-controls').style.display = 'flex';
        // updateAdminStats call removed
    }

    if (phase === 'lobby') {
        // If I am NOT logged in (and not admin), stay in login screen
        if (!myPlayerId && !isAdmin) {
            showScreen('login');
            return;
        }

        showScreen('lobby');
        // Listen for players count
        db.ref('players').on('value', (snap) => {
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
    else if (phase === 'game' || phase === 'question') { // Handle both naming conventions if any
        showScreen('game');
        renderQuestion(questionIdx);

        // Admin: VER EXACTAMENTE LO MISMO QUE EL ALUMNO (Modo Espejo)
        if (isAdmin) {
            // Solo desactivar la interacción para no votar por error
            const btns = document.querySelectorAll('.option-btn');
            btns.forEach(b => {
                b.style.pointerEvents = 'none'; // No clickable
                b.style.cursor = 'default';
            });
            document.getElementById('feedback-msg').textContent = "Proyectando pregunta...";
        }

        if (reveal) {
            showReveal(questionIdx);
        } else {
            // Estado normal de pregunta (sin revelar)
            const btns = document.querySelectorAll('.option-btn');
            btns.forEach(b => {
                // Restaurar visual
                b.classList.remove('disabled');
                b.style.opacity = "1";
                b.innerHTML = questions[questionIdx].options[b.dataset.idx];
                // Si es admin, mantener desactivado el click
                if (isAdmin) b.style.pointerEvents = 'none';
            });
            document.getElementById('correct-answer-reveal').style.display = 'none';
        }
    }
    else if (phase === 'results') {
        showScreen('results');
        renderChart(questionIdx);

        // Forzar visibilidad del bloque de respuesta y explicación
        const revealAndExplainBox = document.getElementById('correct-answer-reveal');
        revealAndExplainBox.style.display = 'block';
        revealAndExplainBox.classList.remove('hidden');

        const q = questions[questionIdx];
        document.getElementById('correct-text').innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 1rem;">✅ ${q.options[q.correct]}</div>
            <div style="font-size: 1.2rem; color: #444; font-weight: normal; padding: 15px; background: #FFF9C4; border-left: 5px solid #FBC02D; border-radius: 8px; text-align: left;">
                ${q.explanation}
            </div>
        `;

        // Mostrar Leaderboard Parcial (Top 5)
        renderPartialLeaderboard();
    }
    else if (phase === 'final') {
        showScreen('final');
        renderPodium();

        // Mostrar Tabla Detallada SOLO AL ADMIN
        if (isAdmin) {
            renderAdminResultsTable();
        }
    }
}


function renderPartialLeaderboard() {
    // Buscar o crear contenedor para el leaderboard parcial
    let partialContainer = document.getElementById('partial-leaderboard');
    if (!partialContainer) {
        partialContainer = document.createElement('div');
        partialContainer.id = 'partial-leaderboard';
        partialContainer.style.marginTop = "2rem";
        partialContainer.style.width = "100%";
        document.getElementById('screen-results').appendChild(partialContainer);
    }

    partialContainer.innerHTML = '<h3 style="color:#666; font-size:1.2rem; margin-bottom:1rem;">🏆 Top 5 Actual</h3>';

    db.ref('players').orderByChild('score').limitToLast(5).once('value', snap => {
        const sorted = [];
        snap.forEach(c => sorted.push(c.val()));
        sorted.reverse(); // Mayor a menor

        sorted.forEach((p, i) => {
            const row = document.createElement('div');
            row.style.background = "white";
            row.style.color = "#333";
            row.style.padding = "10px 15px";
            row.style.margin = "5px 0";
            row.style.borderRadius = "50px";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.fontWeight = "bold";
            row.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

            row.innerHTML = `
                <span>${i + 1}. ${p.name}</span>
                <span style="background:var(--ieu-orange); color:white; padding:2px 10px; border-radius:10px;">${p.score} pts</span>
            `;
            partialContainer.appendChild(row);
        });
    });
}



function renderQuestion(idx) {
    const q = questions[idx];
    document.getElementById('q-text').textContent = q.q;
    const cont = document.getElementById('options-container');

    // Solo regenerar si cambió la pregunta para no borrar selección
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

    // Check my answer
    if (!isAdmin) {
        db.ref(`players/${myPlayerId}/lastAnswer`).once('value', s => {
            const myAns = s.val();
            const msg = document.getElementById('feedback-msg');
            if (myAns === q.correct) {
                msg.textContent = "¡CORRECTO! +100 puntos 🎉";
                msg.style.color = "#4CAF50";
                playSound('success'); // Alumno festeja su acierto
            } else {
                msg.textContent = "Incorrecto 😢";
                msg.style.color = "#F44336";
            }
        });
    } else {
        // Admin: Limpiar mensaje o poner algo neutro
        const msg = document.getElementById('feedback-msg');
        msg.textContent = "";
        msg.style.display = 'none';

        // Sonido de revelación global para la proyección (Festejo)
        playSound('cheer');
    }
}

// --- AUDIO FX ---
const sounds = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    cheer: new Audio('https://assets.mixkit.co/active_storage/sfx/95/95-preview.mp3'),
    reveal: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3')
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play().catch(e => console.log("Audio play blocked (user must interact first)", e));
    }
}

// --- ADMIN LOGIC ---

function enableAdminMode() {
    isAdmin = true;
    document.body.classList.add('admin-mode'); // Activar estilos de proyección
    alert("Modo Profesor Activado 👨‍🏫\n\nAsegúrate de estar proyectando esta pantalla.");
    showScreen('lobby');
    document.getElementById('admin-controls').style.display = 'flex';

    // Initial State Check -> if null, set lobby
    db.ref('gameState').once('value', s => {
        if (!s.exists()) adminResetGame();
    });
}

// Ensure Admin Reset clears everything properly
function adminResetGame() {
    if (!confirm("⚠️ ¿REINICIAR TODO? Se borrarán todos los jugadores y puntos.")) return;

    // Nuke Players
    db.ref('players').remove();

    // Reset State
    db.ref('gameState').set({ phase: 'lobby', questionIdx: 0, reveal: false });

    alert("Juego Reiniciado. Pide a los alumnos que recarguen su página.");
}

// Add logout sanity check on load
if (localStorage.getItem('ieu_playerName')) {
    // Check if player still exists in DB, otherwise logout
    if (myPlayerId) {
        db.ref(`players/${myPlayerId}`).once('value', s => {
            if (!s.exists()) {
                localStorage.removeItem('ieu_playerName');
                localStorage.removeItem('ieu_playerId');
                location.reload();
            }
        });
    }
}

function adminNextPhase() {
    db.ref('gameState').once('value', snap => {
        let state = snap.val();
        let { phase, questionIdx, reveal } = state;

        if (phase === 'lobby') {
            // Start Game -> Q1
            db.ref('gameState').update({ phase: 'question', questionIdx: 0, reveal: false });
        }
        else if (phase === 'question') {
            if (!reveal) {
                // Reveal Answer
                db.ref('gameState').update({ reveal: true });

                // Calculate Scores
                calculateScores(questionIdx);
            } else {
                // Go to Chart/Results
                db.ref('gameState').update({ phase: 'results' });
            }
        }
        else if (phase === 'results') {
            // Next Question or Final
            const nextIdx = questionIdx + 1;
            if (nextIdx < questions.length) {
                // Reset Answers for next Q
                db.ref('players').once('value', ps => {
                    ps.forEach(p => p.ref.update({ lastAnswer: -1 }));
                });
                db.ref('gameState').update({ phase: 'question', questionIdx: nextIdx, reveal: false });
            } else {
                // SAVE HISTORY BEFORE SHOWING FINAL SCREEN
                saveGameHistory();
                db.ref('gameState').update({ phase: 'final' });
            }
        }
    });
}

function saveGameHistory() {
    db.ref('players').once('value', snap => {
        const playersData = snap.val();
        if (!playersData) return;

        const sessionData = {
            timestamp: Date.now(),
            date: new Date().toISOString(),
            totalQuestions: questions.length,
            players: playersData
        };

        // Push to history node
        db.ref('history/sessions').push(sessionData);
        console.log("Game history saved!");
    });
}

function calculateScores(qIdx) {
    const correctOpt = questions[qIdx].correct;
    db.ref('players').once('value', snap => {
        snap.forEach(playerSnap => {
            const p = playerSnap.val();
            if (p.lastAnswer === correctOpt) {
                // Add points (simple +100)
                playerSnap.ref.update({ score: (p.score || 0) + 100 });
            }
        });
    });
}

// --- CHARTS & PODIUM ---

function renderChart(qIdx) {
    const container = document.getElementById('chart-container');
    container.innerHTML = '';

    // Contar respuestas
    const counts = [0, 0, 0, 0];
    db.ref('players').once('value', snap => {
        snap.forEach(p => {
            const ans = p.val().lastAnswer;
            if (ans >= 0 && ans < 4) counts[ans]++;
        });

        // Render Bars
        const max = Math.max(...counts, 1);
        const colors = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"]; // Kahoot Colors

        counts.forEach((val, i) => {
            const height = (val / max) * 100;
            const col = document.createElement('div');
            col.className = 'bar-col';
            col.innerHTML = `
                <div class="bar-val">${val}</div>
                <div class="bar" style="height: ${height}%; background: ${colors[i]};"></div>
                <div style="margin-top:5px; font-weight:bold; font-size: 1.2rem;">${String.fromCharCode(65 + i)}</div>
            `;
            container.appendChild(col);
        });
    });
}

function renderPodium() {
    const pod = document.getElementById('podium-container');
    pod.innerHTML = '';

    db.ref('players').orderByChild('score').limitToLast(5).once('value', snap => {
        const sorted = [];
        snap.forEach(c => sorted.push(c.val()));
        sorted.reverse(); // Highest first

        sorted.forEach((p, i) => {
            const row = document.createElement('div');
            row.style.background = i === 0 ? "gold" : (i === 1 ? "silver" : (i === 2 ? "#cd7f32" : "white"));
            row.style.color = i > 2 ? "#333" : "#000";
            row.style.padding = "1rem";
            row.style.margin = "0.5rem 0";
            row.style.borderRadius = "10px";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.fontSize = "1.2rem";
            row.style.fontWeight = "bold";

            row.innerHTML = `
                <span>#${i + 1} ${p.name}</span>
                <span>${p.score} pts</span>
            `;
            pod.appendChild(row);
        });
    });
}

// --- ADMIN RESULTS TABLE (New) ---
function renderAdminResultsTable() {
    let tableContainer = document.getElementById('admin-results-table');
    if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.id = 'admin-results-table';
        tableContainer.style.marginTop = "3rem";
        tableContainer.style.background = "white";
        tableContainer.style.padding = "20px";
        tableContainer.style.borderRadius = "15px";
        tableContainer.style.overflowX = "auto";
        document.getElementById('screen-final').appendChild(tableContainer);
    }

    tableContainer.innerHTML = '<h3>📊 Tabla Detallada de Resultados</h3><p>Cargando datos...</p>';

    db.ref('players').once('value', snap => {
        let html = `
            <table style="width:100%; border-collapse: collapse; font-size: 0.9rem; color: #333;">
                <thead>
                    <tr style="background:var(--ieu-orange); color:white; text-align:left;">
                        <th style="padding:10px;">Jugador</th>
                        <th style="padding:10px;">Puntaje</th>
        `;

        // Add Headers for questions
        questions.forEach((q, i) => {
            html += `<th style="padding:10px; text-align:center;">Q${i + 1}</th>`;
        });

        html += `</tr></thead><tbody>`;

        const players = [];
        snap.forEach(p => players.push(p.val()));

        // Sort by score desc like leaderboard
        players.sort((a, b) => b.score - a.score);

        players.forEach((p, index) => {
            const bg = index % 2 === 0 ? '#f9f9f9' : '#fff';
            html += `<tr style="background:${bg}; border-bottom:1px solid #eee;">
                        <td style="padding:10px; font-weight:bold;">${p.name}</td>
                        <td style="padding:10px;">${p.score}</td>`;

            // Loop questions for storing answers
            questions.forEach((q, qIndex) => {
                let cellContent = '-';
                let cellColor = '#ccc';

                // Check if answer exists in history
                if (p.answers && p.answers[qIndex] !== undefined) {
                    const ans = p.answers[qIndex];
                    if (ans === q.correct) {
                        cellContent = '✅';
                        cellColor = '#e8f5e9'; // Light green
                    } else {
                        cellContent = '❌';
                        // cellContent += ` (${String.fromCharCode(65 + ans)})`; // Option letter
                        cellColor = '#ffebee'; // Light red
                    }
                }

                html += `<td style="padding:10px; text-align:center; background:${cellColor};">${cellContent}</td>`;
            });

            html += `</tr>`;
        });

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
    });
}

// --- HISTORY EXPORT ---
function downloadHistoryCSV() {
    db.ref('history/sessions').once('value', snap => {
        const history = snap.val();
        if (!history) {
            alert("No hay historial disponible.");
            return;
        }

        let csv = "Fecha,Hora,Jugador,Puntaje,Preguntas Totales,Aciertos\n";

        Object.values(history).forEach(session => {
            const date = new Date(session.timestamp).toLocaleDateString();
            const time = new Date(session.timestamp).toLocaleTimeString();
            const qTotal = session.totalQuestions || 0;

            if (session.players) {
                Object.values(session.players).forEach(p => {
                    // Count correct answers if detailed answers exist
                    let correctCount = 0;
                    if (p.answers) {
                        // Estimate correct count if not explicitly saved, 
                        // though we usually save score. 
                        // Let's use score/100 as rough proxy if needed, 
                        // but detailed logic is better if structure matches.
                        // Ideally we check against current questions but they might have changed.
                        // So we trust the score or rely on answers array if mapped to current.
                        // Let's just output score for safety.
                        correctCount = p.score / 100;
                    } else {
                        correctCount = p.score / 100;
                    }

                    csv += `${date},${time},"${p.name}",${p.score},${qTotal},${correctCount}\n`;
                });
            }
        });

        // Download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "historial_clase_ieu.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
