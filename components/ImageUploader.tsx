import React, { useState, useRef, useCallback } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
  title: string;
  subtitle: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, subtitle }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
        onImageUpload(file, base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
        // You might want to show an error to the user here
      }
    }
  }, [onImageUpload]);

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileChange(file || null);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-white mb-2">{title}</label>
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors duration-200 ${isDragOver ? 'border-cyan-500 bg-slate-800/50' : 'border-slate-700 hover:border-slate-600'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelected}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="text-center text-slate-400 cursor-pointer p-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800/80 rounded-full">
                 <ImageIcon className="h-6 w-6 text-slate-500" />
              </div>
            </div>
            <p className="font-semibold text-slate-300">
              <span className="text-cyan-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};
