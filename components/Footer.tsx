

import React from 'react';
import { SAMBOAT_AFFILIATE_URL } from '../constants';
import { FooterProps } from '../types'; 


const Footer: React.FC<FooterProps> = ({ 
  onShowPrivacyPolicy, 
  onShowTermsOfService,
  onNavigateToMainApp,
  onNavigateToBlogIndex,
}) => {
  const linkStyle = "hover:text-teal-400 focus:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-sm px-1";
  
  return (
    <footer className="bg-gradient-to-r from-teal-600 via-sky-500 to-teal-400 text-white py-6 px-4 rounded-b-2xl shadow-xl mt-8 no-print">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">BoatTrip Planner</span>
          <span className="text-xs bg-white/20 rounded px-2 py-1 ml-2">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <button onClick={onShowPrivacyPolicy} className="hover:underline focus:outline-none">Privacidad</button>
          <button onClick={onShowTermsOfService} className="hover:underline focus:outline-none">Términos</button>
          <button onClick={onNavigateToMainApp} className="hover:underline focus:outline-none">Inicio</button>
          {onNavigateToBlogIndex && <button onClick={onNavigateToBlogIndex} className="hover:underline focus:outline-none">Blog</button>}
        </div>
        {/* Aquí iría el slot de anuncios si está habilitado */}
      </div>
    </footer>
  );
};

export default Footer;