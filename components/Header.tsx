import React from 'react';
import { AppLogo } from './icons/AppLogo';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="flex items-center gap-4">
        <AppLogo className="h-8 w-8" />
        <div>
          <h1 className="text-xl font-bold text-white">AI Photoshoot</h1>
          <p className="text-sm text-slate-400">Create professional headshots from a single image</p>
        </div>
      </div>
    </header>
  );
};
