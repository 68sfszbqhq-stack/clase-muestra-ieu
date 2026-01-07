// SYSTEM: Diario de Aprendizaje (Metacognición)
// Permite guardar reflexiones y otorga XP

function saveJournalEntry() {
    const input = document.getElementById('journal-input');
    const feedback = document.getElementById('journal-feedback');
    const content = input.value.trim();

    if (!content) {
        alert("Escribe algo antes de guardar tu reflexión.");
        return;
    }

    // Obtener usuario actual (Reuso lógica de forum/core)
    let uid = null;
    const user = firebase.auth().currentUser;

    if (user) {
        uid = user.uid;
    } else {
        const guest = JSON.parse(localStorage.getItem('lms_guest_user'));
        if (guest) uid = guest.uid;
    }

    if (!uid) {
        alert("Error de sesión. Recarga la página.");
        return;
    }

    // Guardar en Firebase
    const entry = {
        content: content,
        date: new Date().toISOString(),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        module: 'dashboard_generic' // Podría ser dinámico según dónde esté
    };

    firebase.database().ref('users/' + uid + '/journal').push(entry)
        .then(() => {
            // UI Feedback
            input.value = "";
            feedback.style.display = "inline";
            setTimeout(() => {
                feedback.style.display = "none";
            }, 3000);

            // TODO: Sumar XP real aquí
            console.log("Diario guardado");
        })
        .catch(err => {
            console.error(err);
            alert("Error al guardar: " + err.message);
        });
}
