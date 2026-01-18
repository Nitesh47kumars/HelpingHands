import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineExplore, MdArrowBack } from 'react-icons/md';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] overflow-hidden px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-60%] rounded-full bg-blue-900/10 blur-[160px]" />
      </div>

      <div className="max-w-2xl w-full text-center z-10">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-white/5 select-none">
          404
        </h1>
        
        <div className="-mt-12 md:-mt-10">
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Page not found
          </h2>

          <div className="inline-flex items-center gap-2 px-1 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest mb-6">
            <MdOutlineExplore size={12} />
            Lost in Space
          </div>
          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another galaxy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all w-full sm:w-auto justify-center"
            >
              <MdArrowBack size={20} />
              Go Back
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] w-full sm:w-auto"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
          Error Code: NULL_POINTER_COMMUNITY
        </p>
      </div>
    </div>
  );
};

export default Error;