// AI ASSISTANT MODULE (Gemini Integration)
// Conecta el laboratorio con Google AI Studio para análisis pedagógico

let USER_API_KEY = localStorage.getItem('lms_gemini_key') || "";

class SportsAI {

    static async analyzeSport(sportName) {
        if (!USER_API_KEY) {
            const key = prompt("🔑 Ingresa tu API Key de Google Gemini para activar al Asistente:");
            if (key) {
                USER_API_KEY = key;
                localStorage.setItem('lms_gemini_key', key);
            } else {
                return null;
            }
        }

        const aiPrompt = `
            Actúa como un DOCTOR EN CIENCIAS DEL DEPORTE Y METODOLOGÍA DEL ENTRENAMIENTO.
            El usuario es un entrenador en formación. Tu misión es generar un INFORME CIENTÍFICO-PEDAGÓGICO detallado para planificar la temporada de: "${sportName}".

            ESTRUCTURA OBLIGATORIA DEL INFORME (Formato Markdown):

            # 1. ANÁLISIS DEL DEPORTISTA Y LA DISCIPLINA 🧬
            - **Diagnóstico Fisiológico:** Describe el morfotipo ideal, fibras musculares predominantes (Tipo I, IIa, IIx) y demandas biomecánicas.
            - **Perfil de Entrada:** Sugiere qué evaluaciones iniciales son imprescindibles (ej: Test de Cooper, RM, Postura).

            # 2. CLASIFICACIÓN DEPORTIVA 📊
            - Define si es Cíclico, Acíclico o Mixto.
            - Justifica basándote en la *variabilidad motriz* y la *incertidumbre del entorno*.

            # 3. BIOENERGÉTICA APLICADA ⚡
            - **Sistema Dominante:** (ATP-PC, Glucolítico o Oxidativo). Explica la relación Potencia vs Capacidad.
            - **Interacción de Sistemas:** ¿Cómo participan los otros sistemas durante la competencia real?

            # 4. CAPACIDADES DETERMINANTES 🏋️
            - Jerarquiza: 1. Fundamental, 2. Complementaria, 3. Derivada.
            - Justifica cada una (ej: "La fuerza explosiva es clave por...").

            # 5. OBJETIVOS Y PICOS DE FORMA 🎯
            - Propuesta de Cronograma: ¿Cuántos Macrociclos? (Mono, Bi o Tricíclico) según el calendario típico de este deporte.
            - Justificación de la puesta a punto (Tapering).

            # 6. MODELO DE PERIODIZACIÓN SUGERIDO 📅
            - Recomienda un modelo (Tradicional Matveyev, ATR, Bloques Verkhoshansky).
            - Argumenta por qué ese modelo se ajusta a las adaptaciones biológicas de este deporte.

            # 7. DINÁMICA DE LAS CARGAS 📈
            - Principios de Progresión: Volumen vs Intensidad en Pretemporada y Competencia.
            - Densidad del estímulo: Relación Trabajo/Descanso sugerida.

            # 8. SELECCIÓN DE MEDIOS Y MÉTODOS 🛠️
            - Ejemplos concretos de ejercicios:
              * **Generales:** Para base.
              * **Específicos:** Transferencia directa.
              * **Competitivos:** Situación real.

            ---
            
            SALIDA JSON REQUERIDA:
            {
                "technical_data": {
                    "type": "...", 
                    "energy": "...",
                    "priority": "...",
                    "grid_type": "..." 
                },
                "summary": "Frase contundente que resuma la estrategia metodológica.",
                "full_report": "TU INFORME CIENTÍFICO COMPLETO AQUÍ (Usa Markdown riguroso)."
            }
            
            Nota técnica para JSON:
            "type" -> "ciclico" / "aciclico".
            "energy" -> "atp-pc" / "glucolitico" / "oxidativo" / "mixto".
            "priority" -> "fuerza" / "velocidad" / "resistencia" / "tecnica".
            "grid_type" -> "1", "2" o "3".
        `;

        const MODELS_TO_TRY = [
            'gemini-1.5-flash',      // ESTÁNDAR ORO (Rápido y Estable)
            'gemini-2.0-flash-exp',  // Nueva Generación (Si tienes acceso)
            'gemini-1.5-pro'         // Mayor razonamiento
        ];

        let lastError = null;

        for (const model of MODELS_TO_TRY) {
            try {
                console.log(`📡 Intentando conectar con modelo: ${model}...`);
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${USER_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: aiPrompt }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errData = await response.json();

                    // DETECTOR DE KEY INVÁLIDA
                    // Si la key expiró o es inválida, no tiene sentido probar otros modelos.
                    if (errData.error?.message?.includes("API key") || response.status === 400) {
                        alert("🚫 TU API KEY HA EXPIRADO O ES INVÁLIDA.\n\nEl sistema la borrará ahora. Por favor, recarga e ingresa una nueva.");
                        localStorage.removeItem('lms_gemini_key');
                        location.reload(); // Recarga forzosa para limpiar estado
                        return null;
                    }

                    throw new Error(errData.error?.message || `Error ${response.status}`);
                }

                const data = await response.json();

                // Parsear respuesta
                let rawText = data.candidates[0].content.parts[0].text;
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

                return JSON.parse(rawText);

            } catch (error) {
                console.warn(`❌ Falló modelo ${model}:`, error.message);
                lastError = error;
                // Esperar 1.5s antes de reintentar para no saturar
                await new Promise(r => setTimeout(r, 1500));
            }
        }

        // Si llegamos aquí, todos los modelos fallaron. Usamos FALLBACK LOCAL.
        console.warn(`⚠️ API Falló (${lastError?.message}). Activando Cerebro Local.`);
        return this.localAnalysis(sportName);
    }

    static localAnalysis(sport) {
        // Fallback enriquecido
        const term = sport.toLowerCase();
        let tech = { type: "aciclico", energy: "mixto", priority: "tecnica", grid_type: "2" };
        let report = "## Informe de Respaldo (IA Desconectada)\n\nNo se pudo generar el reporte detallado. Se aplican valores por defecto basados en heurística local.";

        if (term.includes("natacion") || term.includes("correr") || term.includes("maraton")) {
            tech = { type: "ciclico", energy: "oxidativo", priority: "resistencia", grid_type: "1" };
            report = `## Informe Técnico: ${sport} (Modo Local)\n\n1. **Clasificación**: Deporte Cíclico de tiempo y marca.\n2. **Sistema**: Predominio Oxidativo / Aeróbico.\n3. **Capacidades**: Resistencia Aeróbica como base, Potencia Aeróbica como determinante.`;
        }

        if (term.includes("futbol") || term.includes("basket")) {
            tech = { type: "aciclico", energy: "mixto", priority: "tecnica", grid_type: "2" };
            report = `## Informe Técnico: ${sport} (Modo Local)\n\n1. **Clasificación**: Deporte Acíclico de invasión/equipo.\n2. **Sistema**: Mixto (Intermitente de Alta Intensidad).\n3. **Capacidades**: Resistencia a la repetición de sprints (RSA).`;
        }

        alert("⚠️ Google AI sigue saturada o Key inválida. Mostrando datos locales básicos.");

        return {
            technical_data: tech,
            summary: "Análisis local activado por falta de conexión IA.",
            full_report: report
        };
    }

    static resetKey() {
        localStorage.removeItem('lms_gemini_key');
        USER_API_KEY = "";
        alert("API Key borrada.");
    }
}
