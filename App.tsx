
import React, { useState, useCallback } from 'react';
import type { Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { ChefHatIcon } from './components/icons/ChefHatIcon';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipes = useCallback(async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }

    setIsLoading(true);
    setRecipes([]);
    setError(null);

    try {
      const generatedRecipes = await generateRecipes(ingredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError('Failed to generate recipes. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-green-100 text-green-700 p-3 rounded-full mb-4">
             <ChefHatIcon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            AI Recipe Generator
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Turn your leftover ingredients into delicious meals. Just list what you have, and let AI do the magic!
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <IngredientInput
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onGenerate={handleGenerateRecipes}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-12">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && recipes.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p className="text-lg">Your culinary creations will appear here.</p>
                <p className="text-sm">Ready to get cooking?</p>
              </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 mt-8 text-sm text-gray-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
