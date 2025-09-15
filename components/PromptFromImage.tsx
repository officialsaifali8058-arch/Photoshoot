

import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { generatePromptFromImage } from '../services/geminiService';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface PromptFromImageProps {
  onPromptGenerated: (prompt: string) => void;
  onError: (message: string) => void;
}

export const PromptFromImage: React.FC<PromptFromImageProps> = ({ onPromptGenerated, onError }) => {
  const [inspirationImage, setInspirationImage] = useState<{ file: File, base64: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (file: File, base64: string) => {
    setInspirationImage({ file, base64 });
  };

  const handleGenerateClick = async () => {
    if (!inspirationImage) {
      onError("Please upload an inspiration image first.");
      return;
    }
    setIsLoading(true);
    try {
      const prompt = await generatePromptFromImage(inspirationImage.base64, inspirationImage.file.type);
      onPromptGenerated(prompt);
    } catch (error: any) {
      onError(error.message || "An unknown error occurred while generating the prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <ImageUploader 
        onImageUpload={handleImageUpload}
        title="3. Get Prompt from Image (Optional)"
        subtitle="Upload a style reference"
      />
      <button
        onClick={handleGenerateClick}
        disabled={!inspirationImage || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-200 font-bold py-3 px-4 rounded-xl transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <LightbulbIcon className="h-5 w-5" />
            Generate Style Prompt
          </>
        )}
      </button>
    </div>
  );
};
