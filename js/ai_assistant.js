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
            Actúa como un Experto Metodólogo Deportivo de Alto Rendimiento.
            Vas a planificar el macrociclo para el deporte: "${sportName}".
            Genera un REPORTE TÉCNICO COMPLETO basado rigurosamente en estos 8 FUNDAMENTOS:

            1. Análisis Inicial: Perfil fisiológico y antropométrico ideal.
            2. Clasificación: Cíclico o Acíclico (y por qué).
            3. Sistemas Energéticos: Identificar el predominante (ATP-PC, Glucolítico, Oxidativo) y los secundarios.
            4. Capacidades Físicas: Ordenar por prioridad (Fuerza, Velocidad, Resistencia, Flexibilidad).
            5. Objetivos y Calendario: Propuesta de picos de forma (1, 2 o 3 cimas).
            6. Periodización: Sugerencia de modelo (Tradicional, ATR, Bloques) y fases críticas.
            7. Distribución de Cargas: Principios de volumen vs intensidad para este deporte.
            8. Selección de Medios: Ejemplos de ejercicios específicos (Generales vs Específicos).

            Responde ÚNICAMENTE en este formato JSON válido:
            {
                "technical_data": {
                    "type": "...", 
                    "energy": "...",
                    "priority": "...",
                    "grid_type": "..." 
                },
                "summary": "Resumen de 1 linea del enfoque pedagógico.",
                "full_report": "Aquí escribe el reporte detallado de los 8 puntos usando formato Markdown (usa saltos de línea \\n). Sé profesional, académico y directo."
            }
            
            Nota: 
            - "type" debe ser "ciclico" o "aciclico".
            - "energy" debe ser "atp-pc", "glucolitico", "oxidativo" o "mixto".
            - "priority" debe ser "fuerza", "velocidad", "resistencia" o "tecnica".
            - "grid_type" debe ser "1", "2" o "3" (picos).
        `;

        const MODELS_TO_TRY = [
            'gemini-pro',            // Alias Universal (Suele ser v1.0 o 1.5 estable)
            'gemini-1.5-flash',      // Rápido y barato
            'gemini-2.0-flash-exp'   // Experimental (potente pero con cuota estricta)
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
                // Continuamos al siguiente modelo...
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
