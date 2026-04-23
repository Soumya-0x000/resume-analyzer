import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function aiResponse(jobDescription, resume, selfDescription) {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { text: jobDescription },
                    { text: resume },
                    { text: selfDescription },
                ],
            },
        ],
    });
}
