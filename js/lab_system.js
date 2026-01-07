// LAB SYSTEM LOGIC
// Usamos Dragula para el Drag & Drop fluido

document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    initDragDrop();
});

const TOTAL_MONTHS = 12;
const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function initTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';

    for (let i = 0; i < TOTAL_MONTHS; i++) {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';
        slot.dataset.index = i;
        slot.innerHTML = `<div class="slot-label">${MONTH_NAMES[i]}</div>`;
        container.appendChild(slot);
    }
}

let drake;

function initDragDrop() {
    const source = document.getElementById('source-container');
    const slots = Array.from(document.querySelectorAll('.timeline-slot'));

    // Configurar Dragula
    // source -> copy: true (para que no se acaben los bloques)
    // slots -> acepra drops

    drake = dragula([source, ...slots], {
        copy: function (el, source) {
            return source.id === 'source-container'; // Copiar solo si viene de la paleta
        },
        accepts: function (el, target, source, sibling) {
            // Solo aceptar 1 bloque por slot (si está vacío o reemplazando?)
            // Para simplificar: Solo aceptar si target NO es la palette
            if (target.id === 'source-container') return false;

            // Si el slot ya tiene un hijo (además del label), no aceptar (reemplazo estricto)
            // Filtramos hijos que sean 'draggable-block'
            const existing = Array.from(target.children).filter(c => c.classList.contains('draggable-block'));
            return existing.length === 0;
        },
        removeOnSpill: true // Si lo sacas del slot, se borra
    });

    drake.on('drop', (el, target, source, sibling) => {
        if (target.id !== 'source-container') {
            // Ajustar estilo al soltar (quitar márgenes viejos si los hubiera)
            el.style.margin = "0";
            el.style.width = "100%";
            el.style.height = "100%";
            el.style.display = "flex";
            el.style.justifyContent = "center";
            el.style.alignItems = "center";

            // Reproducir sonido snap?
        }
    });
}

function resetLab() {
    if (confirm("¿Borrar todo el plan?")) {
        const slots = document.querySelectorAll('.timeline-slot');
        slots.forEach(s => {
            // Eliminar hijos que sean bloques
            const blocks = s.querySelectorAll('.draggable-block');
            blocks.forEach(b => b.remove());
        });
        document.getElementById('feedback-box').style.display = 'none';
        drake.cancel(true);
    }
}

// --- LOGIC ENGINE (EL CEREBRO DE VALIDACIÓN) ---
function validatePlan() {
    const plan = [];
    const slots = document.querySelectorAll('.timeline-slot');

    // 1. Extraer Datos
    slots.forEach((s, i) => {
        const block = s.querySelector('.draggable-block');
        if (block) {
            plan.push({ month: i, type: block.dataset.type });
        } else {
            plan.push({ month: i, type: null }); // Vacío
        }
    });

    // 2. Analizar Errores (Constructivismo)
    const errors = [];
    let hasGral = false;
    let hasComp = false;

    // Regla 0: Vacíos
    const filledCount = plan.filter(p => p.type).length;
    if (filledCount < 6) {
        showFeedback("error", "Error: El plan está muy incompleto. Llena al menos 6 meses.");
        return;
    }

    // Regla 1: Secuencia Lógica (Matveev)
    // Debe ser: Gral -> Esp -> Pre -> Comp -> Trans
    // Vamos a recorrer y checar transiciones inválidas
    for (let i = 0; i < plan.length - 1; i++) {
        const curr = plan[i].type;
        const next = plan[i + 1].type;

        if (!curr || !next) continue; // Saltar huecos

        // Detectar regresiones graves (Ej: Comp -> Gral sin Transición)
        if (curr === 'comp' && next === 'gral') {
            errors.push(`Mes ${MONTH_NAMES[i]} a ${MONTH_NAMES[i + 1]}: ¡Cuidado! Pasaste de Competencia a General sin Transición. Riesgo de lesión.`);
        }

        // Detectar salto cuántico (Ej: Gral -> Comp)
        if (curr === 'gral' && next === 'comp') {
            errors.push(`Mes ${MONTH_NAMES[i]} a ${MONTH_NAMES[i + 1]}: Salto imposible. Falta preparación Específica y Pre-competitiva.`);
        }

        // Detectar orden inverso raro (Pre -> Gral)
        if (curr === 'pre' && next === 'gral') {
            errors.push(`Mes ${MONTH_NAMES[i]}: ¿Volver a General estando casi listo para competir? Incoherente.`);
        }
    }

    // Regla 2: Presencia de componentes
    hasGral = plan.some(p => p.type === 'gral');
    hasComp = plan.some(p => p.type === 'comp');

    if (!hasGral) errors.push("Falta BASE: No incluiste Preparación General.");
    if (!hasComp) errors.push("Falta OBJETIVO: No hay ninguna Competencia.");

    // Regla 3: Proporciones (Matveev Clásico pide mucha base)
    const gralCount = plan.filter(p => p.type === 'gral').length;
    if (gralCount < 3 && hasComp) { // Si hay competencia pero poca base
        errors.push("Modelo Clásico: La Preparación General es muy corta (menos de 3 meses).");
    }

    // 3. Resultado
    if (errors.length > 0) {
        showFeedback("error", "⚠️ Problemas detectados:\n" + errors.join("\n"));
    } else {
        showFeedback("success", "🏆 ¡Excelente Planificación! \nCumple con los principios de progresividad y ondulación del modelo Clásico.");
        // Aquí podríamos dar XP al usuario
    }
}

function showFeedback(type, text) {
    const box = document.getElementById('feedback-box');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    box.style.display = 'block';
    box.className = 'feedback-panel ' + (type === 'success' ? 'feedback-success' : 'feedback-error');

    title.textContent = type === 'success' ? 'Plan Aprobado' : 'Revisión Necesaria';
    msg.innerText = text; // innerText respeta saltos de línea

    // Scroll to bottom
    box.scrollIntoView({ behavior: 'smooth' });
}
