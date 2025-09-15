

import React from 'react';
import { ImageUploader } from './ImageUploader';
import { AspectRatioSelector } from './AspectRatioSelector';
import { PromptFromImage } from './PromptFromImage';
import { PromptControls } from './PromptControls';

interface ControlPanelProps {
  onUserImageUpload: (file: File, base64: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReadyToGenerate: boolean;
  onError: (message: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  return (
    <aside className="w-full lg:w-96 xl:w-[420px] flex-shrink-0 space-y-8">
      <div className="p-6 bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-800 space-y-6">
        <ImageUploader 
            onImageUpload={props.onUserImageUpload}
            title="1. Upload Your Face"
            subtitle="Use a clear, front-facing photo"
        />
      </div>
      <div className="p-6 bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-800 space-y-6">
        <AspectRatioSelector 
            selectedRatio={props.aspectRatio}
            onRatioChange={props.onAspectRatioChange}
        />
      </div>
      <div className="p-6 bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-800 space-y-6">
        <PromptFromImage 
            onPromptGenerated={props.onPromptChange}
            onError={props.onError}
        />
      </div>
       <div className="p-6 bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-800 space-y-6">
        <PromptControls 
            prompt={props.prompt}
            onPromptChange={props.onPromptChange}
            onGenerate={props.onGenerate}
            isLoading={props.isLoading}
            isReadyToGenerate={props.isReadyToGenerate}
        />
      </div>
    </aside>
  );
};
