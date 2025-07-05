import React from 'react';
import { MapPinIcon } from '../icons/MapPinIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { WindIcon } from '../icons/WindIcon';
import { ChecklistIcon } from '../icons/ChecklistIcon';
import { InfoOutlineIcon } from '../icons/InfoOutlineIcon';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  const stepIcons = [
    <InfoOutlineIcon key="icon-info" className="w-7 h-7 text-primary inline-block mr-1" />, // Experiencia
    <MapPinIcon key="icon-map" className="w-7 h-7 text-primary inline-block mr-1" />, // Ruta
    <UsersIcon key="icon-users" className="w-7 h-7 text-primary inline-block mr-1" />, // Tripulación
    <WindIcon key="icon-wind" className="w-7 h-7 text-secondary inline-block mr-1" />, // Preferencias
    <ChecklistIcon key="icon-checklist" className="w-7 h-7 text-accent inline-block mr-1" /> // Revisar
  ];

  return (
    <nav aria-label="Progreso del formulario" className="mb-6 sm:mb-10">
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${isCompleted ? 'bg-primary' : 'bg-slate-200'}`}></div>
                )}
                <span
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-lg sm:text-xl font-bold shadow border-2 transition-all duration-300 font-bold bg-white ${isCurrent ? 'border-primary text-primary' : isCompleted ? 'border-accent text-accent' : 'border-slate-200 text-slate-400'}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCurrent ? stepIcons[index] : stepNumber}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep > stepNumber + 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                )}
              </div>
              <p className={`mt-2 sm:mt-4 text-xs sm:text-base font-bold text-center hidden sm:block ${isCurrent ? 'text-primary' : isCompleted ? 'text-accent' : 'text-slate-400'}`}>{step}</p>
              <p className={`mt-2 sm:mt-4 text-xs font-bold text-center sm:hidden ${isCurrent ? 'text-primary' : isCompleted ? 'text-accent' : 'text-slate-400'}`}>{stepNumber}</p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressStepper;