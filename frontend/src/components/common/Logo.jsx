import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const iconDimensions = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className={`relative flex items-center justify-center ${dimensions} rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-[2px] shadow-md shadow-indigo-500/20 ${className}`}>
      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
        <svg
          className={`${iconDimensions} text-sky-400`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Interlocking AI node & Target skill icon */}
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity="0.4" />
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#logo-grad)" stroke="none" />
          <defs>
            <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
