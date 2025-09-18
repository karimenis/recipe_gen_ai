
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      description: "A list of generated recipes.",
      items: {
        type: Type.OBJECT,
        properties: {
          recipeName: {
            type: Type.STRING,
            description: "The name of the recipe."
          },
          description: {
            type: Type.STRING,
            description: "A short, enticing description of the dish."
          },
          ingredients: {
            type: Type.ARRAY,
            description: "A list of all ingredients required for the recipe.",
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            description: "Step-by-step cooking instructions.",
            items: { type: Type.STRING }
          }
        },
        required: ["recipeName", "description", "ingredients", "instructions"]
      }
    }
  },
  required: ["recipes"]
};


export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
  const prompt = `Based on the following ingredients, generate 3 diverse recipe ideas. For each recipe, provide a short, enticing description, the full list of ingredients needed (including what I have and others I might need), and clear, step-by-step cooking instructions. Ingredients: ${ingredients}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (parsedJson && Array.isArray(parsedJson.recipes)) {
        return parsedJson.recipes as Recipe[];
    } else {
        console.error("Unexpected JSON structure:", parsedJson);
        throw new Error("Failed to parse recipes from API response.");
    }

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("An error occurred while communicating with the AI model.");
  }
};
