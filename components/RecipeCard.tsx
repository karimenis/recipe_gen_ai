
import React from 'react';
import type { Recipe } from '../types';
import { ChefHatIcon } from './icons/ChefHatIcon';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{recipe.recipeName}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
      </div>
      
      <div className="px-6 pb-6 flex-grow">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b-2 border-green-200 pb-1">Ingredients</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b-2 border-green-200 pb-1">Instructions</h4>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="bg-green-50 p-4 mt-auto text-center text-green-700 font-medium flex items-center justify-center gap-2">
        <ChefHatIcon className="w-5 h-5" />
        <span>Bon Appétit!</span>
      </div>
    </div>
  );
};

export default RecipeCard;
