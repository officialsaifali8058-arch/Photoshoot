import React from 'react';
import { ExpandIcon } from './icons/ExpandIcon';

interface EnhancedResultGalleryProps {
  title: string;
  originalImage: string;
  generatedImages: string[];
  onFullscreen: (imageUrl: string, originalImageUrl?: string) => void;
}

export const EnhancedResultGallery: React.FC<EnhancedResultGalleryProps> = ({
  title,
  originalImage,
  generatedImages,
  onFullscreen,
}) => {
  if (generatedImages.length === 0) {
    return null;
  }

  const isSingleImage = generatedImages.length === 1;

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className={`grid gap-4 ${isSingleImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {isSingleImage && (
          <div className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <img src={originalImage} alt="Original" className="w-full h-full object-contain"/>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-lg">Original</span>
            </div>
          </div>
        )}
        {generatedImages.map((img, index) => (
          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <img src={img} alt={`${title} ${index + 1}`} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => onFullscreen(img, isSingleImage ? originalImage : undefined)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
                title="View Fullscreen"
              >
                <ExpandIcon className="h-6 w-6" />
              </button>
            </div>
             {isSingleImage && (
                 <div className="absolute top-2 left-2 bg-teal-600/80 text-white text-xs font-semibold uppercase tracking-wider py-1 px-2 rounded-full z-10">
                    Enhanced
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
