import React from 'react';
import { Button } from '../Button';
import { WizardNavigationProps } from '../../types';

const WizardNavigation: React.FC<WizardNavigationProps> = ({ currentStep, onNext, onBack, isLoading, isNextDisabled }) => {
  return (
    <div className="flex justify-between items-center pt-6 sm:pt-10 border-t border-bg-wave bg-white rounded-b-2xl mt-6 sm:mt-10 fade-in" style={{backdropFilter:'blur(0px)'}}>
      {currentStep > 1 ? (
        <Button 
          type="button" 
          onClick={onBack} 
          variant="secondary" 
          disabled={isLoading} 
          className="text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-4 font-bold"
          aria-label="Volver al paso anterior"
        >
          &larr; Atrás
        </Button>
      ) : (
        <span></span>
      )}
      <Button 
        type="button" 
        onClick={onNext} 
        variant="primary" 
        disabled={isLoading || isNextDisabled} 
        className="text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-4 font-bold animate-subtle-pulse disabled:animate-none"
        aria-label="Continuar al siguiente paso"
      >
        Siguiente &rarr;
      </Button>
    </div>
  );
};

export default WizardNavigation;
