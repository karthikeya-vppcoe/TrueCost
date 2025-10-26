import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// The API key is accessed via process.env.API_KEY as per the instructions.
// This is configured externally.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text content as a string.
 */
export const generateContent = async (prompt: string): Promise<string> => {
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
        throw new Error("Failed to generate content from Gemini API.");
    }
};
