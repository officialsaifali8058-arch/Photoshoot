

import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReadyToGenerate: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, onPromptChange, onGenerate, isLoading, isReadyToGenerate }) => {
  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-2">
          4. Define Your Style
        </label>
        <textarea
          id="prompt"
          rows={6}
          className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder:text-slate-500"
          placeholder="e.g., A professional headshot, studio lighting, looking directly at the camera, smiling, plain grey background..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={!isReadyToGenerate || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform active:scale-95 text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="h-6 w-6" />
            Generate Photoshoot
          </>
        )}
      </button>
    </div>
  );
};
