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
            Actúa como un Experto Fisiólogo Deportivo y Pedagogo. Analiza el deporte: "${sportName}".
            Basado en los fundamentos del entrenamiento:
            1. Clasifícalo: "ciclico" o "aciclico".
            2. Sistema Energético Predominante: "atp-pc", "glucolitico", "oxidativo" o "mixto".
            3. Capacidad Prioritaria: "fuerza", "velocidad", "resistencia" o "tecnica".
            4. Explica POR QUÉ brevemente (máximo 40 palabras) con enfoque constructivista.

            Responde ÚNICAMENTE en formato JSON plano así:
            {
                "type": "...",
                "energy": "...",
                "priority": "...",
                "explanation": "..."
            }
        `;

        const MODELS_TO_TRY = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-1.0-pro',
            'gemini-2.0-flash-exp'
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
                    throw new Error(errData.error?.message || `Error ${response.status}`);
                }

                const data = await response.json();

                // Parsear respuesta
                let rawText = data.candidates[0].content.parts[0].text;
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

                return JSON.parse(rawText); // ¡ÉXITO! Retornamos y salimos del bucle.

            } catch (error) {
                console.warn(`❌ Falló modelo ${model}:`, error.message);
                lastError = error;
                // Continuamos al siguiente modelo...
            }
        }

        // Si llegamos aquí, todos fallaron
        if (lastError) {
            alert(`⚠️ No se pudo conectar con ninguna IA.\nError final: ${lastError.message}`);
        }
        return null;
    }

    static resetKey() {
        localStorage.removeItem('lms_gemini_key');
        USER_API_KEY = "";
        alert("API Key borrada.");
    }
}
