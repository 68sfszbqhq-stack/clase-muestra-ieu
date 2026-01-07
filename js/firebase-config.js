// Configuración Centralizada de Firebase
// (Reusamos la que ya me diste para el Examen)

const firebaseConfig = {
    apiKey: "AIzaSyCys_vb7penAxx0vYZxa8UKZLVbIKCNMS0",
    authDomain: "claseieu.firebaseapp.com",
    projectId: "claseieu",
    storageBucket: "claseieu.firebasestorage.app",
    messagingSenderId: "1061581896742",
    appId: "1:1061581896742:web:8e33255a37409a64407ae7"
};

// Evitar reinicializar si ya existe
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();
