
import React from 'react';

interface IngredientInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ value, onChange, onGenerate, isLoading }) => {
  return (
    <div className="w-full">
      <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
        What ingredients do you have?
      </label>
      <textarea
        id="ingredients"
        value={value}
        onChange={onChange}
        placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
        className="w-full h-28 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow duration-200"
        rows={3}
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !value.trim()}
        className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Recipes'
        )}
      </button>
    </div>
  );
};

export default IngredientInput;
