import React from 'react';
import { Button } from './Button';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTermsOfService: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
    onAccept,
    onDecline,
    onShowPrivacyPolicy,
    onShowTermsOfService
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-200 p-3 shadow-lg z-50 no-print">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex-grow text-center sm:text-left">
            <p className="text-xs sm:text-sm">
            Utilizamos cookies y tecnologías similares para el funcionamiento esencial de la web, mejorar tu experiencia y, con tu permiso, para analítica avanzada y mostrarte anuncios personalizados de Google. Al Aceptar, consientes el uso de tus datos para todos estos fines. Puedes rechazar o gestionar tus preferencias en cualquier momento. Consulta nuestra{' '}
            <button onClick={onShowPrivacyPolicy} className="underline hover:text-white focus:outline-none focus:ring-1 focus:ring-teal-300 rounded-sm">Política de Privacidad</button> y nuestros{' '}
            <button onClick={onShowTermsOfService} className="underline hover:text-white focus:outline-none focus:ring-1 focus:ring-teal-300 rounded-sm">Términos de Servicio</button>.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={onAccept}
              variant="primary"
              size="sm"
              className="flex-shrink-0 w-full sm:w-auto px-4 py-2" 
              aria-label="Aceptar y cerrar banner de consentimiento"
            >
              Aceptar
            </Button>
            <Button
              onClick={onDecline}
              variant="secondary"
              size="sm"
              className="bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400 flex-shrink-0 w-full sm:w-auto px-4 py-2"
              aria-label="Rechazar y cerrar banner de consentimiento"
            >
              Rechazar
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;