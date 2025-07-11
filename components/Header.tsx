import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex?: () => void;
  currentView: AppView;
}

const Header: React.FC<HeaderProps> = ({ title, onNavigateHome, onNavigateToBlogIndex, currentView }) => {
  const isBlogViewActive = currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST;

  return (
    <header className="bg-gradient-to-r from-teal-600 via-sky-500 to-teal-400 text-white shadow-xl rounded-t-2xl no-print">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between gap-x-3 sm:gap-x-4">
        <button
          onClick={onNavigateHome}
          className="group focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-teal-600 rounded-lg px-3 py-2 sm:px-4 border-2 border-teal-700 hover:border-white hover:bg-teal-700/60 transition-colors duration-150 flex-shrink min-w-0"
          aria-label={`Ir a la página principal de ${title.split('|')[0].trim()}`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg group-hover:text-slate-100 transition-colors duration-150 break-words">
            {title}
          </h1>
        </button>
        {onNavigateToBlogIndex && (
          <button
            onClick={onNavigateToBlogIndex}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-teal-600 flex-shrink-0
              ${isBlogViewActive 
                ? 'bg-white text-teal-700 shadow-md ring-2 ring-teal-300/70'
                : 'bg-teal-700 hover:bg-teal-600 text-white hover:text-slate-100'}
            `}
            aria-current={isBlogViewActive ? 'page' : undefined}
          >
            Blog
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;