import React from 'react';
import { AppView } from '../types';
import { GuidanceSailIcon } from './icons/GuidanceSailIcon';

interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex?: () => void;
  currentView: AppView;
}

const Header: React.FC<HeaderProps> = ({ title, onNavigateHome, onNavigateToBlogIndex, currentView }) => {
  const isBlogViewActive = currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST;

  return (
    <header className="shadow-none border-b border-border bg-white" style={{position:'relative', zIndex:10, minHeight:'60px', padding:'0.5em 0'}}>
      <div className="container flex items-center justify-between gap-x-6 py-3">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 focus:outline-none bg-transparent border-0 hover:opacity-80 transition-opacity"
          aria-label={`Ir a la página principal de ${title.split('|')[0].trim()}`}
        >
          <GuidanceSailIcon className="w-9 h-9 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide" style={{color:'#155fa0', margin:0}}>{title}</h1>
        </button>
        {onNavigateToBlogIndex && (
          <button
            onClick={onNavigateToBlogIndex}
            className={`px-5 py-2 rounded-full font-semibold text-primary border border-primary bg-white hover:bg-primary hover:text-white transition-all duration-150 shadow-none ${isBlogViewActive ? 'bg-primary text-white' : ''}`}
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