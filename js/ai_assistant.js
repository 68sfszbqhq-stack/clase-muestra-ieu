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

        try {
            // Usamos 'gemini-pro' (1.0), el estándar más compatible y seguro actualmente
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${USER_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: aiPrompt }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("AI Error:", data.error);
                if (data.error.code === 429) {
                    alert("⏳ La IA está saturada (Límite de Cuota). Espera 30seg y reintenta.");
                } else {
                    alert("Error de IA: " + data.error.message);
                }
                return null;
            }

            // Parsear respuesta (Gemini a veces devuelve markdown en el texto)
            let rawText = data.candidates[0].content.parts[0].text;
            // Limpiar bloques de código si existen
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(rawText);

        } catch (error) {
            console.error("Network Error:", error);
            alert("Error de conexión con la IA.");
            return null;
        }
    }

    static resetKey() {
        localStorage.removeItem('lms_gemini_key');
        USER_API_KEY = "";
        alert("API Key borrada.");
    }
}
