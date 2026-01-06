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
        q: "Observa la gráfica: Inicio con VOLUMEN gigante (Azul) e INTENSIDAD baja. Al final se cruzan (Tijeretazo). ¿Qué modelo es?",
        options: ["Modelo ATR", "Modelo Clásico (Matveev)", "Modelo de Bloques", "Péndulo"],
        correct: 1,
        explanation: "💡 POR QUÉ: Es la firma visual de Matveev. El volumen crea la base piramidal ancha al inicio, y debe bajar forzosamente para que suba la intensidad."
    },
    {
        q: "La analogía del 'LÁSER vs BOMBILLA' explica la diferencia entre Cargas Concentradas y Distribuidas. ¿A qué modelo corresponde el LÁSER?",
        options: ["Modelo de Bloques (Verkhoshansky)", "Modelo Clásico", "Modelo Multicíclico", "Ninguno"],
        correct: 0,
        explanation: "💡 POR QUÉ: Verkhoshansky propone concentrar toda la energía en una sola capacidad (Fuerza) como un láser, en vez de iluminar todo suavemente (repartir cargas) como el modelo clásico."
    },
    {
        q: "En el fútbol, no podemos parar 3 meses para entrenar base. Usamos bloques cortos: Acumulación, Transformación y...",
        options: ["Competición", "Recuperación", "Realización", "Transición"],
        correct: 2,
        explanation: "💡 POR QUÉ: El ciclo ATR termina en Realización. Es cuando el embudo suelta el 'chorro' de rendimiento acumulado para el partido del domingo."
    },
    {
        q: "El modelo de 'Doble Pico' (Bicíclico) se usa cuando hay dos competencias fundamentales. ¿Qué se necesita en medio de ambas?",
        options: ["Más entrenamiento intenso", "Un valle de Transición/Recuperación", "Competencias secundarias", "Nada"],
        correct: 1,
        explanation: "💡 POR QUÉ: No puedes saltar de la cima del Everest al K2. Debes bajar al campamento base (Transición) para regenerar física y mentalmente antes de volver a subir."
    },
    {
        q: "¿Cuál es el objetivo principal del Modelo Pendular (Boxeo)?",
        options: ["Ganar masa muscular", "Evitar el aburrimiento del Sistema Nervioso", "Entrenar solo técnica", "Correr maratones"],
        correct: 1,
        explanation: "💡 POR QUÉ: Alternar cargas Generales y Específicas (como un columpio) mantiene al Sistema Nervioso 'fresco' y evita la acomodación o estancamiento ante estímulos monótonos."
    }
];

// --- STATE MANAGMENT ---
let myPlayerId = localStorage.getItem('ieu_playerId');
let myName = localStorage.getItem('ieu_playerName');
let isAdmin = false;

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

    // Send to Firebase
    db.ref(`players/${myPlayerId}/lastAnswer`).set(optionIdx);
}

// --- SYNC LOGIC (CORE) ---

function syncInterface(state) {
    const { phase, questionIdx, reveal } = state;

    // Admin UI always shows controls
    if (isAdmin) {
        document.getElementById('admin-controls').style.display = 'flex';
        updateAdminStats(questionIdx);
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
    db.ref(`players/${myPlayerId}/lastAnswer`).once('value', s => {
        const myAns = s.val();
        const msg = document.getElementById('feedback-msg');
        if (myAns === q.correct) {
            msg.textContent = "¡CORRECTO! +100 puntos 🎉";
            msg.style.color = "#4CAF50";
        } else {
            msg.textContent = "Incorrecto 😢";
            msg.style.color = "#F44336";
        }
    });
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
                db.ref('gameState').update({ phase: 'final' });
            }
        }
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
