import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-70 flex flex-col items-center justify-center z-[70] no-print cursor-wait"
            role="dialog"
            aria-modal="true"
            aria-live="polite"
        >
            <div className="text-center p-8 rounded-lg">
                <LoadingSpinner size="md" />
                <p className="mt-4 text-lg text-white text-center font-semibold animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
