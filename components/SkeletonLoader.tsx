import React from 'react';

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative w-full h-full bg-slate-800/50 rounded-xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
  );
};
