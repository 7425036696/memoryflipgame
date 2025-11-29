import { GoogleGenAI, Type } from "@google/genai";
import { ThemeGenerationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateThemeItems = async (themeInput: string): Promise<ThemeGenerationResponse> => {
  try {
    const model = "gemini-2.5-flash";
    // Increased to 12 items to support Hard difficulty (10 pairs) + buffer
    const prompt = `Generate a list of 12 distinct, recognizable, and simple items (emojis or short 1-2 word concepts) for a memory matching game based on the theme: "${themeInput}". 
    Also provide a short, catchy title for this theme.
    Ensure the items are visually distinct to make the game playable.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 12 distinct emojis or words.",
            },
            themeName: {
              type: Type.STRING,
              description: "A short, catchy title for the theme.",
            },
          },
          required: ["items", "themeName"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ThemeGenerationResponse;
    }
    
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback
    return {
      items: ["🍎", "🍌", "🍇", "🍓", "🍒", "🍑", "🍍", "🥝", "🍉", "🍋", "🍐", "🥥"],
      themeName: "Fruit Salad (Fallback)",
    };
  }
};