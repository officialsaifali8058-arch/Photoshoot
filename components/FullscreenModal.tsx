import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomOutIcon } from './icons/ZoomOutIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CompareIcon } from './icons/CompareIcon';

interface FullscreenModalProps {
  imageUrl: string;
  originalImageUrl?: string;
  onClose: () => void;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ imageUrl, originalImageUrl, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isComparing, setIsComparing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const isPanning = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const currentImageUrl = isComparing && originalImageUrl ? originalImageUrl : imageUrl;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prevScale => {
        const newScale = direction === 'in' ? prevScale * 1.2 : prevScale / 1.2;
        if (newScale < 0.5) return 0.5;
        if (newScale > 5) return 5;
        if (newScale <= 1) {
            setPosition({ x: 0, y: 0 });
        }
        return newScale;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        handleZoom('in');
    } else {
        handleZoom('out');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
        e.preventDefault();
        isPanning.current = true;
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        if (imageRef.current) {
            imageRef.current.style.cursor = 'grabbing';
        }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
        e.preventDefault();
        setPosition({
            x: e.clientX - startPos.current.x,
            y: e.clientY - startPos.current.y,
        });
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    if (imageRef.current) {
        imageRef.current.style.cursor = scale > 1 ? 'grab' : 'default';
    }
  };

  const resetZoomAndPan = useCallback(() => {
      setScale(1);
      setPosition({x: 0, y: 0});
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileSuffix = isComparing ? 'original' : (originalImageUrl ? 'enhanced' : 'generated');
    link.download = `ai-photoshoot-${timestamp}-${fileSuffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    resetZoomAndPan();
    setIsComparing(false);
  }, [imageUrl, resetZoomAndPan]);

  return (
    <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center fade-in"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen image viewer"
    >
        <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full text-white transition-colors" aria-label="Close fullscreen view">
              <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-2 bg-slate-800/50 backdrop-blur-lg rounded-full border border-slate-700">
            <button onClick={() => handleZoom('out')} disabled={scale <= 0.5} className="p-2 text-white hover:bg-slate-700 disabled:opacity-50 rounded-full transition-colors" aria-label="Zoom out">
              <ZoomOutIcon className="h-6 w-6" />
            </button>
            <div className="text-white text-sm font-mono w-16 text-center">{Math.round(scale * 100)}%</div>
            <button onClick={() => handleZoom('in')} className="p-2 text-white hover:bg-slate-700 rounded-full transition-colors" aria-label="Zoom in">
              <ZoomInIcon className="h-6 w-6" />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            {originalImageUrl && (
                <button onClick={() => setIsComparing(prev => !prev)} className="p-2 text-white hover:bg-slate-700 rounded-full transition-colors" aria-label="Compare original and enhanced images">
                    <CompareIcon className="h-6 w-6" />
                </button>
            )}
            <button onClick={handleDownload} className="p-2 text-white hover:bg-slate-700 rounded-full transition-colors" aria-label="Download image">
              <DownloadIcon className="h-6 w-6" />
            </button>
        </div>

        <div 
            className="w-full h-full flex items-center justify-center overflow-hidden relative"
            onWheel={handleWheel}
        >
            {isComparing && (
                <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full z-10">
                    Original
                </div>
            )}
            {!isComparing && originalImageUrl && (
                <div className="absolute top-4 left-4 bg-teal-600/80 text-white text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full z-10">
                    Enhanced
                </div>
            )}
            <img 
                ref={imageRef}
                src={currentImageUrl} 
                alt={isComparing ? "Original view" : "Generated view"}
                className="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out rounded-lg shadow-2xl"
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    cursor: scale > 1 ? 'grab' : 'default',
                    touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onDragStart={(e) => e.preventDefault()}
            />
        </div>
    </div>
  );
};

export default FullscreenModal;