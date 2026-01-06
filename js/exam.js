// Exam Logic - IEU

// Exam Questions Database
const examQuestions = [
    {
        id: 1,
        question: "¿Cuál es el principal objetivo de esta clase muestra?",
        options: [
            "Aprender conceptos básicos",
            "Conocer la metodología de enseñanza",
            "Evaluar conocimientos previos",
            "Todas las anteriores"
        ],
        correct: 3 // Index of correct answer (0-based)
    },
    {
        id: 2,
        question: "¿Qué ventaja ofrece el aprendizaje interactivo?",
        options: [
            "Mayor retención de información",
            "Participación activa del estudiante",
            "Retroalimentación inmediata",
            "Todas las anteriores"
        ],
        correct: 3
    },
    {
        id: 3,
        question: "La educación moderna se caracteriza por:",
        options: [
            "Uso exclusivo de libros",
            "Tecnología y metodologías innovadoras",
            "Memorización de contenidos",
            "Clases magistrales únicamente"
        ],
        correct: 1
    },
    {
        id: 4,
        question: "¿Cuál es un beneficio del trabajo colaborativo?",
        options: [
            "Desarrollo de habilidades sociales",
            "Aprendizaje de perspectivas diversas",
            "Resolución de problemas complejos",
            "Todas las anteriores"
        ],
        correct: 3
    },
    {
        id: 5,
        question: "El pensamiento crítico implica:",
        options: [
            "Aceptar información sin cuestionar",
            "Analizar y evaluar información objetivamente",
            "Memorizar datos",
            "Seguir instrucciones al pie de la letra"
        ],
        correct: 1
    },
    {
        id: 6,
        question: "¿Qué habilidad es más valorada en el siglo XXI?",
        options: [
            "Memorización",
            "Adaptabilidad y aprendizaje continuo",
            "Seguir procedimientos fijos",
            "Trabajar en aislamiento"
        ],
        correct: 1
    },
    {
        id: 7,
        question: "La retroalimentación efectiva debe ser:",
        options: [
            "Constante y específica",
            "General y poco frecuente",
            "Solo al final del curso",
            "Únicamente negativa"
        ],
        correct: 0
    },
    {
        id: 8,
        question: "¿Qué caracteriza a un buen ambiente de aprendizaje?",
        options: [
            "Competencia extrema",
            "Silencio absoluto",
            "Colaboración y respeto mutuo",
            "Individualismo"
        ],
        correct: 2
    },
    {
        id: 9,
        question: "El aprendizaje significativo ocurre cuando:",
        options: [
            "Memorizamos información",
            "Conectamos conocimientos nuevos con previos",
            "Copiamos sin entender",
            "Evitamos hacer preguntas"
        ],
        correct: 1
    },
    {
        id: 10,
        question: "¿Cuál es el rol del estudiante en la educación moderna?",
        options: [
            "Receptor pasivo de información",
            "Participante activo en su aprendizaje",
            "Memorizar sin cuestionar",
            "Solo escuchar al profesor"
        ],
        correct: 1
    }
];

// State
let studentAnswers = {};

// DOM Elements
const questionsContainer = document.getElementById('questionsContainer');
const examForm = document.getElementById('examForm');
const resultsContainer = document.getElementById('resultsContainer');
const examInstructions = document.getElementById('examInstructions');

// Initialize Exam
function initExam() {
    renderQuestions();
    loadSavedAnswers();
}

// Render all questions
function renderQuestions() {
    questionsContainer.innerHTML = examQuestions.map((q, index) => `
        <div class="question-card" data-question-id="${q.id}">
            <span class="question-number">Pregunta ${q.id}</span>
            <p class="question-text">${q.question}</p>
            <div class="options-container">
                ${q.options.map((option, optIndex) => `
                    <button type="button" 
                            class="option-btn" 
                            data-question-id="${q.id}" 
                            data-option-index="${optIndex}"
                            onclick="selectOption(${q.id}, ${optIndex})">
                        <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                        <span>${option}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Select an option
function selectOption(questionId, optionIndex) {
    // Save answer
    studentAnswers[questionId] = optionIndex;

    // Update UI
    const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
    const allOptions = questionCard.querySelectorAll('.option-btn');

    allOptions.forEach(btn => btn.classList.remove('selected'));
    const selectedBtn = questionCard.querySelector(`[data-question-id="${questionId}"][data-option-index="${optionIndex}"]`);
    selectedBtn.classList.add('selected');

    // Save to localStorage
    saveAnswers();
}

// Save answers to localStorage
function saveAnswers() {
    localStorage.setItem('examAnswers', JSON.stringify(studentAnswers));
}

// Load saved answers
function loadSavedAnswers() {
    const saved = localStorage.getItem('examAnswers');
    if (saved) {
        studentAnswers = JSON.parse(saved);

        // Restore UI state
        Object.keys(studentAnswers).forEach(questionId => {
            const optionIndex = studentAnswers[questionId];
            const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
            if (questionCard) {
                const selectedBtn = questionCard.querySelector(`[data-option-index="${optionIndex}"]`);
                if (selectedBtn) {
                    selectedBtn.classList.add('selected');
                }
            }
        });
    }
}

// Submit exam
examForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if all questions are answered
    if (Object.keys(studentAnswers).length < examQuestions.length) {
        alert('Por favor responde todas las preguntas antes de enviar el examen.');
        return;
    }

    // Calculate score
    const results = calculateScore();

    // Show results
    showResults(results);
});

// Calculate score
function calculateScore() {
    let correct = 0;
    let incorrect = 0;

    examQuestions.forEach(q => {
        const studentAnswer = studentAnswers[q.id];
        if (studentAnswer === q.correct) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const total = examQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    const score = Math.round((correct / total) * 10); // Score out of 10

    return {
        correct,
        incorrect,
        total,
        percentage,
        score
    };
}

// Show results
function showResults(results) {
    // Hide exam form
    examForm.classList.add('hidden');
    examInstructions.classList.add('hidden');

    // Show results container
    resultsContainer.classList.remove('hidden');

    // Update results
    document.getElementById('scoreNumber').textContent = results.score;
    document.getElementById('correctCount').textContent = results.correct;
    document.getElementById('incorrectCount').textContent = results.incorrect;
    document.getElementById('grade').textContent = results.percentage;

    // Message based on score
    const messageEl = document.getElementById('resultsMessage');
    const textEl = document.getElementById('resultsText');

    if (results.percentage >= 90) {
        messageEl.textContent = '¡Excelente trabajo! 🎉';
        textEl.textContent = 'Tienes un dominio sobresaliente del tema.';
    } else if (results.percentage >= 70) {
        messageEl.textContent = '¡Muy bien! ✨';
        textEl.textContent = 'Demuestras un buen entendimiento del contenido.';
    } else if (results.percentage >= 60) {
        messageEl.textContent = '¡Buen intento! 👍';
        textEl.textContent = 'Tienes conocimientos básicos, sigue practicando.';
    } else {
        messageEl.textContent = 'Sigue aprendiendo 📚';
        textEl.textContent = 'Revisa el material y vuelve a intentarlo.';
    }

    // Clear saved answers
    localStorage.removeItem('examAnswers');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Optional: Send results to server/database
    // sendResultsToServer(results);
}

// Optional: Send results to server
function sendResultsToServer(results) {
    // Implementar integración con Firebase o backend
    console.log('Results:', results);

    // Example Firebase integration:
    /*
    firebase.firestore().collection('exam_results').add({
        score: results.score,
        percentage: results.percentage,
        correct: results.correct,
        incorrect: results.incorrect,
        timestamp: new Date(),
        answers: studentAnswers
    }).then(() => {
        console.log('Results saved to Firebase');
    }).catch((error) => {
        console.error('Error saving results:', error);
    });
    */
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initExam);

// Console message
console.log(`
%c📝 Examen IEU 📝
%cTotal de preguntas: ${examQuestions.length}
Tus respuestas se guardan automáticamente.
¡Buena suerte! 🍀
`,
    'font-size: 20px; font-weight: bold; color: #FF6B35;',
    'font-size: 14px; color: #1D1D1D;'
);
