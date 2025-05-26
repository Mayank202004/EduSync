import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center dark:bg-black text-gray-800 bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 dark:border-gray-300 border-gray-900"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-medium text-black dark:text-white">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
