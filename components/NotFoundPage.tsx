import React from 'react';
import { Button } from './Button';
import { NotFoundPageProps } from '../types';

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto my-20 border border-blue-100/50 backdrop-blur-sm">
      <h1 className="text-8xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
        404
      </h1>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-6">
        Página No Encontrada
      </h2>
      <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
        ¡Oh, no! Parece que te has perdido en alta mar. La página que buscas no ha sido encontrada en nuestras cartas de navegación.
      </p>
      <Button
        onClick={onNavigateHome}
        variant="primary"
        className="text-xl px-10 py-4"
        aria-label="Volver al planificador"
      >
        Volver al Planificador
      </Button>
    </div>
  );
};

export default NotFoundPage;