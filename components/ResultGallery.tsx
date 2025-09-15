import React from 'react';
import { SkeletonLoader } from './SkeletonLoader';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { VariationsIcon } from './icons/VariationsIcon';
import { ExpandIcon } from './icons/ExpandIcon';

interface ResultGalleryProps {
  imageUrl: string | null;
  isLoading: boolean;
  onEnhance: () => void;
  onGenerateVariations: () => void;
  onFullscreen: () => void;
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({
  imageUrl,
  isLoading,
  onEnhance,
  onGenerateVariations,
  onFullscreen
}) => {
  const isGenerated = !!imageUrl && !isLoading;

  return (
    <div className="flex-1 flex flex-col">
      <div className="relative w-full max-w-2xl mx-auto min-h-[300px] lg:min-h-[400px] max-h-[80vh] bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {isLoading && <SkeletonLoader />}
        {!isLoading && !imageUrl && (
            <div className="text-center text-slate-500">
                <p className="text-lg font-medium">Your photoshoot will appear here</p>
                <p className="text-sm">Upload a photo and enter a prompt to get started</p>
            </div>
        )}
        {isGenerated && (
          <>
            <img src={imageUrl} alt="Generated photoshoot" className="max-w-full max-h-full object-contain" />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button 
                    onClick={onFullscreen}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="View Fullscreen"
                >
                    <ExpandIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2">
              <button 
                onClick={onEnhance}
                className="flex items-center gap-2 py-2 px-4 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <MagicWandIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Enhance</span>
              </button>
              <button 
                onClick={onGenerateVariations}
                className="flex items-center gap-2 py-2 px-4 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <VariationsIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Generate Variations</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
