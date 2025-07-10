import React from 'react';
import { InfoIcon } from './icons/InfoIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

const AndroidCompatibilityAlert: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm mb-4">
      <div className="text-yellow-900 text-sm font-medium">
        <strong>Atención:</strong> El planificador está optimizado para una experiencia fluida en navegadores de <strong>Android</strong> y en <strong>Chrome</strong>. Los usuarios en otras plataformas (especialmente iOS) podrían experimentar algunas limitaciones mientras continuamos mejorando la compatibilidad.
      </div>
    </div>
  );
};

export default AndroidCompatibilityAlert;