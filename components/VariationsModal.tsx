import React, { useState, useEffect } from 'react';
import { VariationConfig } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckIcon } from './icons/CheckIcon';

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (configs: VariationConfig[]) => void;
  isLoading: boolean;
}

const variationOptions = [
    { key: 'posture', label: 'Change Body Posture' },
    { key: 'cameraAngle', label: 'Change Camera Angle' },
    { key: 'expression', label: 'Change Facial Expression' },
    { key: 'direction', label: 'Change Body Direction' },
    { key: 'hyperRealistic', label: 'Make It More Hyper-Realistic' },
    { key: 'aiChoice', label: 'Let AI Decide (Surprise Me!)' },
];

const initialConfigs: VariationConfig[] = [
    { id: 1, options: {} },
    { id: 2, options: {} },
    { id: 3, options: {} },
];
variationOptions.forEach(opt => {
    initialConfigs.forEach(config => {
        config.options[opt.key] = false;
    });
});


export const VariationsModal: React.FC<VariationsModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [configs, setConfigs] = useState<VariationConfig[]>(initialConfigs);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOptionChange = (configId: number, optionKey: string) => {
    setConfigs(prevConfigs => {
        return prevConfigs.map(config => {
            if (config.id === configId) {
                const newOptions = { ...config.options };
                const isChecked = !newOptions[optionKey];
                newOptions[optionKey] = isChecked;

                // If 'AI Choice' is checked, uncheck all others for this variation.
                if (optionKey === 'aiChoice' && isChecked) {
                    Object.keys(newOptions).forEach(key => {
                        if (key !== 'aiChoice') newOptions[key] = false;
                    });
                } 
                // If another option is checked, uncheck 'AI Choice'.
                else if (optionKey !== 'aiChoice' && isChecked) {
                    newOptions['aiChoice'] = false;
                }
                
                return { ...config, options: newOptions };
            }
            return config;
        });
    });
  };

  const handleGenerateClick = () => {
    onGenerate(configs);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center fade-in" role="dialog" aria-modal="true" aria-labelledby="variations-modal-title">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 id="variations-modal-title" className="text-xl font-bold text-white">Generate Variations</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full" aria-label="Close">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        
        <main className="p-6 space-y-6 overflow-y-auto">
            {configs.map(config => (
                <div key={config.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Variation {config.id}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {variationOptions.map(option => (
                            <label key={option.key} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={config.options[option.key]}
                                        onChange={() => handleOptionChange(config.id, option.key)}
                                        className="appearance-none h-5 w-5 rounded border-2 border-slate-500 bg-slate-800 checked:bg-cyan-600 checked:border-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                                    />
                                    {config.options[option.key] && (
                                        <CheckIcon className="h-4 w-4 absolute left-0.5 text-white pointer-events-none" />
                                    )}
                                </div>
                                <span className="text-slate-300 select-none">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </main>

        <footer className="p-4 border-t border-slate-800 mt-auto">
          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 text-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6" />
                Generate Selected Variations
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};
