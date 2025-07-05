import React, { useState } from 'react';
import { WizardStepProps, BudgetLevel, activityOptions } from '../../types';
import { SelectField, InputField, TextAreaField, CheckboxGroup } from '../FormControls';
import { budgetLevelOptions } from '../../constants';
import { InfoIcon } from '../icons/InfoIcon';
import { ChevronIcon } from '../icons/ChevronIcon';
import { CogIcon } from '../icons/CogIcon';
import { WindIcon } from '../icons/WindIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

const formatNumberWithDots = (digits: string): string => {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Step4Preferences: React.FC<WizardStepProps> = ({ data, updateData, errors = {} }) => {
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false);
  const [showActivitiesSection, setShowActivitiesSection] = useState(false);
  const [displayedCustomBudget, setDisplayedCustomBudget] = useState(
      data.customBudgetAmount ? formatNumberWithDots(data.customBudgetAmount.toString()) : ''
  );

  const budgetTooltipId = 'budget-tooltip-content-wizard';
  
  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, ''); 
    
    if (digitsOnly.length <= 10) { 
        setDisplayedCustomBudget(formatNumberWithDots(digitsOnly));
        updateData({ customBudgetAmount: Number(digitsOnly) });
    }
  };
  
  const handleActivityChange = (activity: string) => {
    const newActivities = data.activities.includes(activity)
      ? data.activities.filter(a => a !== activity)
      : [...data.activities, activity];
    updateData({ activities: newActivities });
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center">
            <CogIcon className="mx-auto h-12 w-12 text-teal-500" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mt-2">Personaliza tu Experiencia</h2>
            <p className="text-sm sm:text-base text-slate-600">Añade los toques finales para crear tu plan náutico perfecto.</p>
        </div>

      <div className="space-y-4">
        <div className="relative">
          <SelectField
            label="Presupuesto Estimado (Opcional)"
            id="budgetLevel"
            value={data.budgetLevel || ''}
            onChange={(e) => updateData({ budgetLevel: e.target.value as BudgetLevel | undefined, customBudgetAmount: undefined })}
            options={budgetLevelOptions}
            icon={<WindIcon className="w-5 h-5 text-secondary" />}
          />
          <button
            type="button"
            className="absolute top-0 right-0 mt-1 mr-1 h-5 w-5 text-teal-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded-sm"
            onClick={() => setShowBudgetTooltip(!showBudgetTooltip)}
            aria-label="Información sobre niveles de presupuesto"
            aria-expanded={showBudgetTooltip}
            aria-controls={budgetTooltipId}
          >
            <InfoIcon className="w-full h-full" aria-hidden="true" />
          </button>
          {showBudgetTooltip && (
              <div 
                   id={budgetTooltipId}
                   className="absolute z-20 w-80 p-3 mt-1 text-sm text-white bg-slate-700 rounded-md shadow-lg right-0 sm:left-1/2 sm:-translate-x-1/2"
                   onClick={() => setShowBudgetTooltip(false)}
                   role="tooltip">
                Indica tu presupuesto para ayudarnos a personalizar tu plan: desde opciones económicas hasta experiencias de lujo.
              </div>
          )}
        </div>
        {data.budgetLevel === BudgetLevel.SPECIFIC_AMOUNT && (
          <InputField
            label="Tu Presupuesto en EUR"
            id="customBudgetAmount"
            type="text" 
            value={displayedCustomBudget}
            onChange={handleCustomBudgetChange} 
            placeholder="Ej: 500"
            required
            inputMode="numeric" 
            icon={<SparklesIcon className="w-5 h-5 text-accent" />}
            error={errors.customBudgetAmount}
          />
        )}
        <TextAreaField
          label="Notas Especiales (Opcional)"
          id="budgetNotes"
          value={data.budgetNotes || ''}
          onChange={(e) => updateData({ budgetNotes: e.target.value })}
          placeholder="Ej: Preferencias alimentarias, celebraciones especiales, restricciones, necesidades especiales, etc."
          rows={2}
        />
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100">
        <button
            type="button"
            onClick={() => setShowActivitiesSection(prev => !prev)}
            className="flex items-center justify-between w-full py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 border border-transparent hover:border-slate-300 transition-colors"
            aria-expanded={showActivitiesSection}
            aria-controls="activities-collapsible-section"
        >
            <h3 className="text-md font-medium">🎯 Actividades que Te Interesan (Opcional)</h3>
            <ChevronIcon isOpen={showActivitiesSection} className="w-5 h-5 text-slate-600" aria-hidden="true" />
        </button>
        {showActivitiesSection && (
            <div 
              id="activities-collapsible-section"
              className="space-y-4 pl-3 ml-1 pt-2 pb-1 border-l-2 border-slate-200"
            >
                <p className="text-xs text-slate-500 mb-2">Selecciona las actividades que más te interesan para personalizar tu itinerario</p>
                <CheckboxGroup
                    label="" 
                    options={activityOptions}
                    selectedOptions={data.activities}
                    onChange={handleActivityChange}
                />
                <TextAreaField
                    label="Actividades Especiales o Solicitudes (Opcional)"
                    id="otherActivities"
                    value={data.otherActivities || ''}
                    onChange={(e) => updateData({ otherActivities: e.target.value })}
                    placeholder="Ej: Celebrar un cumpleaños, equipo de snorkel para niños, ruta específica, etc."
                    rows={2}
                />
            </div>
        )}
      </div>
    </div>
  );
};

export default Step4Preferences;