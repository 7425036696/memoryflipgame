import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ThemeGeneratorProps {
  onGenerate: (theme: string) => void;
  isLoading: boolean;
}

export const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input.trim());
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-gray-900 rounded-lg p-1 border border-white/10 shadow-xl">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Theme (e.g. '80s Retro')..."
            className="flex-grow bg-transparent text-white px-3 py-2 sm:px-4 sm:py-3 outline-none placeholder-gray-500 font-medium text-sm sm:text-base min-w-0"
            disabled={isLoading}
            />
            <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 sm:px-5 rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base"
            >
            {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
                <>
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Generate</span>
                <span className="sm:hidden">Go</span>
                </>
            )}
            </button>
        </div>
      </form>
      <div className="text-center mt-2 flex justify-center items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
         <p className="text-[10px] text-gray-400">Powered by Gemini</p>
      </div>
    </div>
  );
};