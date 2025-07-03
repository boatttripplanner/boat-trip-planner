import React from 'react';
import { SAMBOAT_AFFILIATE_URL } from '../constants';
import { FooterProps } from '../types'; 
import { SailboatIcon } from './icons/SailboatIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { MapRouteIcon } from './icons/MapRouteIcon';

const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  const linkStyle = "hover:text-accent focus:text-accent transition-colors duration-200 font-bold text-base px-2 underline-offset-4 hover:underline";
  
  return (
    <footer className="shadow-none border-t border-border bg-bg text-text-secondary" style={{background:'#f6fafd', color:'#5c677d', borderTop:'1px solid #e2e8f0', boxShadow:'none', marginTop:'2em', padding:'2em 0 1em 0', fontSize:'0.98em'}}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <SailboatIcon className="w-7 h-7 text-primary" />
          <span className="font-bold text-base text-primary">BoatTrip Planner</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onNavigateToMainApp} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0">Planificador</button>
          {onNavigateToBlogIndex && <button onClick={onNavigateToBlogIndex} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0">Blog</button>}
          <button onClick={onShowPrivacyPolicy} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0">Privacidad</button>
          <button onClick={onShowTermsOfService} className="hover:underline font-semibold text-primary bg-transparent border-0 p-0">Términos</button>
        </div>
        <div className="text-xs text-text-secondary mt-2 md:mt-0">&copy; {new Date().getFullYear()} BoatTrip Planner</div>
      </div>
    </footer>
  );
};

export default Footer;