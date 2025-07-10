
import React, { useState } from 'react';
import { WizardStepProps, BudgetLevel, activityOptions } from '../../types';
import { SelectField, InputField, TextAreaField, CheckboxGroup } from '../FormControls';
import { budgetLevelOptions } from '../../constants';

const formatNumberWithDots = (digits: string): string => {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Step4Preferences: React.FC<WizardStepProps> = ({ data, updateData }) => {
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
    <div className="space-y-8 animate-fade-in">
        <div className="text-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-8 rounded-2xl border border-violet-100/50 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
              Preferencias y Presupuesto
            </h2>
            <p className="text-lg text-slate-600 font-medium">Añade los toques finales para un plan perfecto.</p>
        </div>

      <div className="space-y-6">
        <div className="relative">
          <SelectField
            label="Nivel de Presupuesto (Opcional)"
            id="budgetLevel"
            value={data.budgetLevel || ''}
            onChange={(e) => updateData({ budgetLevel: e.target.value as BudgetLevel | undefined, customBudgetAmount: undefined })}
            options={budgetLevelOptions}
          />
          <button
            type="button"
            className="absolute top-0 right-0 mt-1 mr-1 h-6 w-6 text-violet-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-lg transition-colors hover:text-violet-600"
            onClick={() => setShowBudgetTooltip(!showBudgetTooltip)}
            aria-label="Información sobre niveles de presupuesto"
            aria-expanded={showBudgetTooltip}
            aria-controls={budgetTooltipId}
          >
            <span className="text-lg font-bold">?</span>
          </button>
          {showBudgetTooltip && (
              <div 
                   id={budgetTooltipId}
                   className="absolute z-20 w-80 p-4 mt-2 text-sm text-white bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-xl right-0 sm:left-1/2 sm:-translate-x-1/2 border border-slate-600/50"
                   onClick={() => setShowBudgetTooltip(false)}
                   role="tooltip">
                Indica un presupuesto para ayudarnos a personalizar tu plan: desde opciones económicas hasta experiencias de lujo.
              </div>
          )}
        </div>
        {data.budgetLevel === BudgetLevel.SPECIFIC_AMOUNT && (
          <InputField
            label="Monto del Presupuesto (EUR)"
            id="customBudgetAmount"
            type="text" 
            value={displayedCustomBudget}
            onChange={handleCustomBudgetChange} 
            placeholder="Ej: 500"
            required
            inputMode="numeric" 
          />
        )}
        <TextAreaField
          label="Notas Adicionales sobre tu Viaje (Opcional)"
          id="budgetNotes"
          value={data.budgetNotes || ''}
          onChange={(e) => updateData({ budgetNotes: e.target.value })}
          placeholder="Ej: Preferencias alimentarias, celebraciones especiales, restricciones, etc."
          rows={2}
        />
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100">
        <button
            type="button"
            onClick={() => setShowActivitiesSection(prev => !prev)}
            className="flex items-center justify-between w-full py-4 text-left text-slate-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 border border-transparent hover:border-rose-200 transition-all duration-200"
            aria-expanded={showActivitiesSection}
            aria-controls="activities-collapsible-section"
        >
            <h3 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Actividades Deseadas (Opcional)</h3>
            <span className={`text-2xl font-bold text-rose-500 transition-transform duration-200 ${showActivitiesSection ? 'rotate-90' : ''}`}>
              ›
            </span>
        </button>
        {showActivitiesSection && (
            <div 
              id="activities-collapsible-section"
              className="space-y-6 pl-6 ml-2 pt-4 pb-2 border-l-2 border-rose-200 bg-gradient-to-r from-rose-50/30 to-pink-50/30 rounded-r-xl"
            >
                <CheckboxGroup
                    label="" 
                    options={activityOptions}
                    selectedOptions={data.activities}
                    onChange={handleActivityChange}
                />
                <TextAreaField
                    label="Otras Actividades o Solicitudes Especiales (Opcional)"
                    id="otherActivities"
                    value={data.otherActivities || ''}
                    onChange={(e) => updateData({ otherActivities: e.target.value })}
                    placeholder="Ej: Celebrar un cumpleaños, equipo de snorkel para niños, etc."
                    rows={2}
                />
            </div>
        )}
      </div>
    </div>
  );
};

export default Step4Preferences;