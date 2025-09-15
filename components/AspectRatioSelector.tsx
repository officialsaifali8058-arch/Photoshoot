import React from 'react';
import { SquareIcon, PortraitIcon, LandscapeIcon, StoryIcon, WidescreenIcon } from './icons/AspectRatioIcons';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
}

const ratios = [
  { value: '1:1', label: 'Square', Icon: SquareIcon },
  { value: '4:3', label: 'Landscape', Icon: LandscapeIcon },
  { value: '3:4', label: 'Portrait', Icon: PortraitIcon },
  { value: '16:9', label: 'Widescreen', Icon: WidescreenIcon },
  { value: '9:16', label: 'Story', Icon: StoryIcon },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-white mb-2">2. Choose Aspect Ratio</label>
      <div className="grid grid-cols-5 gap-2">
        {ratios.map(({ value, label, Icon }) => {
          const isSelected = selectedRatio === value;
          return (
            <button
              key={value}
              onClick={() => onRatioChange(value)}
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-colors duration-200 ${
                isSelected
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
              aria-pressed={isSelected}
              title={label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
