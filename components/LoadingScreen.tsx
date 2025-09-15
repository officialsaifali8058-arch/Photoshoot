import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the virtual studio...",
  "Adjusting the lighting...",
  "Selecting the best lens...",
  "Composing the perfect shot...",
  "Our AI is getting creative...",
  "This can take a minute, great art needs patience!",
  "Polishing the final details...",
  "Almost ready for the big reveal..."
];

interface LoadingScreenProps {
  isLoading: boolean;
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, message }) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentMessage(prev => {
          const currentIndex = messages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 3000); // Change message every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center fade-in">
        <div className="relative w-24 h-24 mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{message}</h2>
        <p className="text-slate-400 transition-opacity duration-500">{currentMessage}</p>
    </div>
  );
};
