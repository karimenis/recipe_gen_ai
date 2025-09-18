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
        const recipes: Omit<Recipe, 'imageUrl'>[] = parsedJson.recipes;

        const recipesWithImages = await Promise.all(
          recipes.map(async (recipe) => {
            try {
              const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `A delicious, high-quality, professional photograph of a plate of "${recipe.recipeName}". ${recipe.description}`,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '4:3',
                },
              });
    
              const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
              const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
              return { ...recipe, imageUrl };

            } catch (imageError) {
              console.error(`Error generating image for ${recipe.recipeName}:`, imageError);
              return { ...recipe, imageUrl: undefined };
            }
          })
        );
        return recipesWithImages;

    } else {
        console.error("Unexpected JSON structure:", parsedJson);
        throw new Error("Failed to parse recipes from API response.");
    }

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("An error occurred while communicating with the AI model.");
  }
};
