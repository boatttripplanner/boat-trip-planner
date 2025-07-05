import React from 'react';
import { FooterProps } from '../types'; 
import { SailboatIcon } from './icons/SailboatIcon';

const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  return (
    <footer className="shadow-none border-t border-border bg-bg text-text-secondary" style={{background:'#f6fafd', color:'#5c677d', borderTop:'1px solid #e2e8f0', boxShadow:'none', marginTop:'2em', padding:'1.5em 0 1em 0', fontSize:'0.98em'}}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <SailboatIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          <span className="font-bold text-sm sm:text-base text-primary">BoatTrip Planner</span>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          <button onClick={onNavigateToMainApp} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0 text-sm sm:text-base">Planificador</button>
          {onNavigateToBlogIndex && <button onClick={onNavigateToBlogIndex} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0 text-sm sm:text-base">Blog</button>}
          <button onClick={onShowPrivacyPolicy} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0 text-sm sm:text-base">Privacidad</button>
          <button onClick={onShowTermsOfService} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0 text-sm sm:text-base">Términos</button>
        </div>
        <div className="text-xs text-text-secondary mt-2 md:mt-0 text-center md:text-left">&copy; {new Date().getFullYear()} BoatTrip Planner</div>
      </div>
    </footer>
  );
};

export default Footer;