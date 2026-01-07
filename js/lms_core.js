// LMS Core Logic

// --- AUTH SYSTEM ---

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            initUserProfile(user);
        }).catch((error) => {
            console.error(error);
            alert("Error al iniciar sesión: " + error.message);
        });
}

function loginGuest() {
    const name = document.getElementById('guest-name').value;
    if (!name) return;

    // Crear usuario anónimo persistente en local
    const guestUser = {
        uid: 'guest_' + Date.now(),
        displayName: name,
        isAnonymous: true
    };

    // Validar si ya existe en localStorage para no crear duplicados
    let stored = localStorage.getItem('lms_guest_user');
    if (stored) {
        initUserProfile(JSON.parse(stored));
    } else {
        localStorage.setItem('lms_guest_user', JSON.stringify(guestUser));
        initUserProfile(guestUser);
    }
}

function initUserProfile(user) {
    // Guardar referencia en DB si es nuevo
    const userRef = db.ref('users/' + user.uid);

    userRef.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Crear perfil inicial (Constructivismo: Diagnóstico)
            userRef.set({
                name: user.displayName,
                email: user.email || 'guest',
                joined: new Date().toISOString(),
                xp: 0,
                level: 1,
                progress: {
                    'module_intro': 0,
                    'module_periodization': 0
                },
                badges: []
            });
        }

        // Redirigir al Dashboard
        window.location.href = 'lms_dashboard.html';
    });
}

// --- SESSION CHECKER (Para poner en dashboard) ---
function checkSession() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("User Logged In:", user.displayName);
            return user;
        } else {
            // Check guest
            const guest = localStorage.getItem('lms_guest_user');
            if (guest) return JSON.parse(guest);

            // Si no hay nadie, bye
            // window.location.href = 'lms_index.html';
        }
    });
}
