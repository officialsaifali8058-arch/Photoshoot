
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};
