import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 flex flex-col items-center justify-center z-50">
            <div className="mb-6 animate-spin rounded-full border-8 border-teal-400 border-t-white h-20 w-20"></div>
            <div className="text-white text-xl font-semibold drop-shadow-lg animate-pulse">{message || 'Cargando...'}</div>
        </div>
    );
};

export default LoadingOverlay;
