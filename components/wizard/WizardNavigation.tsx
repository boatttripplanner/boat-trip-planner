import React from 'react';
import { Button } from '../Button';
import { WizardNavigationProps } from '../../types';

const WizardNavigation: React.FC<WizardNavigationProps> = ({ currentStep, onNext, onBack, isLoading, isNextDisabled }) => {
  return (
    <div className="flex justify-between items-center pt-10 border-t border-bg-wave bg-white rounded-b-2xl mt-10 fade-in" style={{backdropFilter:'blur(0px)'}}>
      {currentStep > 1 ? (
        <Button type="button" onClick={onBack} variant="secondary" disabled={isLoading} className="text-lg px-8 py-4 font-bold">
          &larr; Atrás
        </Button>
      ) : (
        <span></span>
      )}
      <Button type="button" onClick={onNext} variant="primary" disabled={isLoading || isNextDisabled} className="text-lg px-8 py-4 font-bold animate-subtle-pulse disabled:animate-none">
        Siguiente &rarr;
      </Button>
    </div>
  );
};

export default WizardNavigation;
