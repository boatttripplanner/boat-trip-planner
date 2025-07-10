
import React from 'react';
import { Button } from '../Button';
import { WizardNavigationProps } from '../../types';

const WizardNavigation: React.FC<WizardNavigationProps> = ({ currentStep, onNext, onBack, isLoading, isNextDisabled }) => {
  return (
    <div className="flex justify-between items-center pt-5 border-t border-slate-200">
      {currentStep > 1 ? (
        <Button type="button" onClick={onBack} variant="secondary" disabled={isLoading}>
          &larr; Atrás
        </Button>
      ) : (
        <span></span> // Placeholder to keep "Next" button on the right
      )}
      <Button type="button" onClick={onNext} variant="primary" disabled={isLoading || isNextDisabled}>
        Siguiente &rarr;
      </Button>
    </div>
  );
};

export default WizardNavigation;
