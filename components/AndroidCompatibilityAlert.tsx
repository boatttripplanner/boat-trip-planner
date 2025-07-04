import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

const AndroidCompatibilityAlert: React.FC = () => {
  return (
    <div 
      className="bg-teal-100 border-l-4 border-teal-500 text-teal-800 p-4 rounded-md shadow-md" 
      role="alert"
    >
      <div className="flex items-start">
        <div className="py-1">
          <InfoIcon className="h-6 w-6 text-teal-600 mr-3 flex-shrink-0" />
        </div>
        <div>
          <p className="font-bold text-teal-900">Atención:</p>
          <p className="text-sm">
            El planificador está optimizado para una experiencia fluida en navegadores de <strong>Android</strong> y en <strong>Chrome</strong>. 
            Los usuarios en otras plataformas (especialmente iOS) podrían experimentar algunas limitaciones mientras continuamos mejorando la compatibilidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AndroidCompatibilityAlert;