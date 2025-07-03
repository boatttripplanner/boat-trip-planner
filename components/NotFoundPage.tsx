import React from 'react';
import { Button } from './Button';
import { SailboatIcon } from './icons/SailboatIcon';
import { NotFoundPageProps } from '../types';

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg shadow-xl w-full max-w-2xl mx-auto my-10">
      <SailboatIcon className="w-20 h-20 sm:w-24 sm:h-24 text-teal-400 mb-6" />
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-3">404</h1>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-4">Página No Encontrada</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        ¡Oh, no! Parece que te has perdido en alta mar. La página que buscas no ha sido encontrada en nuestras cartas de navegación.
      </p>
      <Button
        onClick={onNavigateHome}
        variant="primary"
        className="text-base sm:text-lg px-6 py-2.5 sm:px-8 sm:py-3"
        aria-label="Volver al planificador"
      >
        ⛵ Volver al Planificador
      </Button>
    </div>
  );
};

export default NotFoundPage;