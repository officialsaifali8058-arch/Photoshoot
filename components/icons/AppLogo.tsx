import React from 'react';

export const AppLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgb(6, 182, 212)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M50 0L96.65 25V75L50 100L3.35 75V25L50 0Z" fill="url(#grad1)"/>
    <path d="M50 15L84.64 32.5V67.5L50 85L15.36 67.5V32.5L50 15Z" stroke="white" strokeWidth="5" />
    <circle cx="50" cy="50" r="12" fill="white"/>
  </svg>
);
