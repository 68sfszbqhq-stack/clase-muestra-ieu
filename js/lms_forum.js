// FORUM & SOCIAL SYSTEM
// Gestiona el chat en tiempo real con Firebase

const currentTopic = "general"; // Por defecto
let currentUser = null;

// Escuchar Auth para saber quién escribe
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = {
            uid: user.uid,
            name: user.displayName || user.email || "Anónimo",
            photo: user.photoURL
        };
        initChatListener();
    } else {
        // Fallback para invitados locales
        const guest = JSON.parse(localStorage.getItem('lms_guest_user'));
        if (guest) {
            currentUser = guest;
            initChatListener();
        }
    }
});

function initChatListener() {
    console.log("Conectado al chat como:", currentUser.name);
    const chatRef = firebase.database().ref('forum/' + currentTopic).limitToLast(50);

    chatRef.on('child_added', (snapshot) => {
        const msg = snapshot.val();
        renderMessage(msg);
    });
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();

    if (!text || !currentUser) return;

    const msgData = {
        text: text,
        uid: currentUser.uid,
        author: currentUser.name,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Push genera una Key única auto-incrementaloide
    firebase.database().ref('forum/' + currentTopic).push(msgData)
        .then(() => {
            input.value = ""; // Limpiar
            scrollToBottom();
            // Aquí podríamos dar XP por participar
        })
        .catch(err => console.error(err));
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function renderMessage(msg) {
    const feed = document.getElementById('chat-feed');
    const isMe = msg.uid === currentUser.uid;

    const div = document.createElement('div');
    div.className = `chat-msg ${isMe ? 'mine' : 'others'}`;

    let html = "";
    if (!isMe) {
        html += `<span class="author">${msg.author}</span>`;
    }
    html += `<span>${escapeHtml(msg.text)}</span>`;

    div.innerHTML = html;
    feed.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    const feed = document.getElementById('chat-feed');
    feed.scrollTop = feed.scrollHeight;
}

// Utilidad anti-XSS simple
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
