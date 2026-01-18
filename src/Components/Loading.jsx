import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c]">
      <div className="relative">
        {/* Glow effect behind the spinner */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
        
        <div className="w-12 h-12 border-4 border-white/5 border-t-blue-600 rounded-full animate-spin" />
      </div>
      
      <p className="mt-4 text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;