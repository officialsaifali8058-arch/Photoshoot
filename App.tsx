import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Header } from './components/Header';
import { ResultGallery } from './components/ResultGallery';
import { EnhancedResultGallery } from './components/EnhancedResultGallery';
import { LoadingScreen } from './components/LoadingScreen';
import FullscreenModal from './components/FullscreenModal';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import * as geminiService from './services/geminiService';
import { VariationsModal } from './components/VariationsModal';
import { VariationConfig } from './types';

interface UserImage {
  file: File;
  base64: string;
}

interface FullscreenState {
  isOpen: boolean;
  imageUrl: string;
  originalImageUrl?: string;
}

function App() {
  const [userImage, setUserImage] = useState<UserImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  
  const [mainResult, setMainResult] = useState<string | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const [fullscreenState, setFullscreenState] = useState<FullscreenState>({ isOpen: false, imageUrl: '', originalImageUrl: undefined });
  const [isVariationsModalOpen, setIsVariationsModalOpen] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const handleUserImageUpload = (file: File, base64: string) => {
    setUserImage({ file, base64 });
    // Reset results when a new image is uploaded
    setMainResult(null);
    setEnhancedResult(null);
    setVariations([]);
  };

  const handleGenerate = async () => {
    if (!userImage || !prompt) {
      addToast("Please upload an image and provide a prompt.", "error");
      return;
    }
    setIsLoading(true);
    setMainResult(null);
    setEnhancedResult(null);
    setVariations([]);
    try {
      const result = await geminiService.generatePhotoshoot(userImage.base64, userImage.file.type, prompt, aspectRatio);
      setMainResult(result);
      addToast("Photoshoot generated successfully!", "success");
    } catch (error: any) {
      addToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEnhance = async () => {
    if (!mainResult) return;
    setIsEnhancing(true);
    setLoadingMessage("Enhancing Image...");
    try {
        const result = await geminiService.enhanceImage(mainResult, 'image/png'); // Assuming output is png
        setEnhancedResult(result);
        setVariations([]); // Clear variations when enhancing
        addToast("Image enhanced successfully!", "success");
    } catch (error: any) {
        addToast(error.message, "error");
    } finally {
        setIsEnhancing(false);
        setLoadingMessage('');
    }
  };

  const handleGenerateCustomVariations = async (configs: VariationConfig[]) => {
    if (!mainResult) return;
    setIsVariationsModalOpen(false);
    setIsGeneratingVariations(true);
    setLoadingMessage("Generating Variations...");
    try {
        const activeConfigs = configs.filter(c => Object.values(c.options).some(val => val === true));
        if (activeConfigs.length === 0) {
            addToast("Please select at least one option for a variation.", "error");
            return;
        }
        const results = await geminiService.generateCustomVariations(mainResult, 'image/png', activeConfigs);
        setVariations(results);
        setEnhancedResult(null); // Clear enhanced result when generating variations
        addToast(`${results.length} variation(s) generated successfully!`, "success");
    } catch (error: any) {
        addToast(error.message, "error");
    } finally {
        setIsGeneratingVariations(false);
        setLoadingMessage('');
    }
  };


  const handleOpenFullscreen = (imageUrl: string, originalImageUrl?: string) => {
    setFullscreenState({ isOpen: true, imageUrl, originalImageUrl });
  };
  
  const handleCloseFullscreen = () => {
    setFullscreenState({ isOpen: false, imageUrl: '', originalImageUrl: undefined });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ControlPanel
            onUserImageUpload={handleUserImageUpload}
            prompt={prompt}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isReadyToGenerate={!!userImage && !!prompt}
            onError={(msg) => addToast(msg, 'error')}
          />
          <div className="flex-1 flex flex-col items-center">
            <ResultGallery 
              imageUrl={mainResult} 
              isLoading={isLoading}
              onEnhance={handleEnhance}
              onGenerateVariations={() => setIsVariationsModalOpen(true)}
              onFullscreen={() => mainResult && handleOpenFullscreen(mainResult)}
            />
            {enhancedResult && (
                <EnhancedResultGallery 
                    title="Enhanced Result"
                    originalImage={mainResult!}
                    generatedImages={[enhancedResult]}
                    onFullscreen={handleOpenFullscreen}
                />
            )}
            {variations.length > 0 && (
                <EnhancedResultGallery 
                    title="Variations"
                    originalImage={mainResult!}
                    generatedImages={variations}
                    onFullscreen={handleOpenFullscreen}
                />
            )}
          </div>
        </div>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <LoadingScreen isLoading={isEnhancing || isGeneratingVariations} message={loadingMessage} />
      {fullscreenState.isOpen && (
        <FullscreenModal 
          imageUrl={fullscreenState.imageUrl}
          originalImageUrl={fullscreenState.originalImageUrl}
          onClose={handleCloseFullscreen} 
        />
      )}
      {mainResult && (
        <VariationsModal
            isOpen={isVariationsModalOpen}
            onClose={() => setIsVariationsModalOpen(false)}
            onGenerate={handleGenerateCustomVariations}
            isLoading={isGeneratingVariations}
        />
      )}
    </div>
  );
}

export default App;
