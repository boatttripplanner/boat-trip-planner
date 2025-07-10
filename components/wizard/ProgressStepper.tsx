
import React from 'react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progreso del formulario" className="mb-8">
      <ol className="flex items-center justify-between w-full max-w-3xl mx-auto">
        {steps.map((step, idx) => (
          <li key={step} className="flex-1 flex flex-col items-center relative">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full border-4 transition-all duration-500 shadow-lg
              ${idx + 1 <= currentStep 
                ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 border-blue-400 text-white scale-110 shadow-blue-500/25' 
                : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-400 hover:scale-105 transition-transform'
              }
            `}>
              <span className="font-bold text-lg">{idx + 1}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className={`absolute left-1/2 top-6 w-full h-1 z-0 transition-all duration-500 ${
                idx + 1 < currentStep 
                  ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400' 
                  : 'bg-gradient-to-r from-slate-200 to-slate-300'
              }`} style={{ transform: 'translateX(24px)' }}></span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressStepper;