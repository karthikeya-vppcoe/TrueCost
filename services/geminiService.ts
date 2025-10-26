import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// The API key is accessed via process.env.API_KEY as per the instructions.
// This is configured externally.
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

// Only initialize if API key is available
if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
    }
}

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text content as a string.
 */
export const generateContent = async (prompt: string): Promise<string> => {
    // Fallback if AI is not initialized
    if (!ai) {
        console.warn("Gemini API not initialized. Check your API key configuration.");
        return "AI features are currently unavailable. Please configure your GEMINI_API_KEY.";
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        // Use the .text property to directly access the text content.
        return response.text;
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        // Handle API errors gracefully.
        // In a real UI, you might want to show a more user-friendly message.
        throw new Error("Failed to generate content from Gemini API. Please check your API key and quota.");
    }
};

/**
 * Check if Gemini API is configured and available
 */
export const isGeminiAvailable = (): boolean => {
    return ai !== null;
};
