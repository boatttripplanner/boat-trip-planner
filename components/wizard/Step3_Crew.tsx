
import React, { useState } from 'react';
import { WizardStepProps, ExperienceLevel, BoatingLicenseType, experienceLevelOptions, boatingLicenseTypeOptions, PlanningMode } from '../../types';
import { InputField, SelectField } from '../FormControls';

const Step3Crew: React.FC<WizardStepProps> = ({ data, updateData }) => {
  const [showExperienceTooltip, setShowExperienceTooltip] = useState(false);
  const experienceTooltipId = 'experience-tooltip-content-wizard';

  const currentExperienceOptions = data.planningMode === PlanningMode.OWN_BOAT
    ? experienceLevelOptions.filter(opt => 
        opt.value === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
        opt.value === ExperienceLevel.EXPERT_ADVANCED_LICENSE
      )
    : experienceLevelOptions;

  const showBoatingLicenseField = 
    data.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
    data.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE ||
    data.planningMode === PlanningMode.OWN_BOAT;

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8 rounded-2xl border border-emerald-100/50 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              Tu Tripulación
            </h2>
            <p className="text-lg text-slate-600 font-medium">Cuéntanos sobre quiénes irán a bordo.</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
            label="Número de Personas"
            id="numPeople"
            type="number"
            value={data.numPeople > 0 ? data.numPeople.toString() : ''} 
            onChange={(e) => {
                const parsedValue = parseInt(e.target.value, 10);
                updateData({ numPeople: isNaN(parsedValue) ? 0 : parsedValue });
            }}
            onBlur={() => {
                if (!data.numPeople || data.numPeople <= 0) {
                    updateData({ numPeople: 1 });
                }
            }}
            min="1"
            required
            />
            <div className="relative">
                <SelectField
                    label="Nivel de Experiencia Náutica"
                    id="experience"
                    value={data.experience}
                    onChange={(e) => {
                        const newExperience = e.target.value as ExperienceLevel;
                        const updates: Partial<typeof data> = { experience: newExperience };
                        if (data.planningMode === PlanningMode.RENTAL && newExperience !== ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER && newExperience !== ExperienceLevel.EXPERT_ADVANCED_LICENSE) {
                           updates.boatingLicense = undefined;
                        }
                        updateData(updates);
                    }}
                    options={currentExperienceOptions}
                />
                <button
                    type="button"
                    className="absolute top-0 right-0 mt-1 mr-1 h-6 w-6 text-emerald-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg transition-colors hover:text-emerald-600"
                    onClick={() => setShowExperienceTooltip(!showExperienceTooltip)}
                    aria-label="Información sobre niveles de experiencia"
                    aria-expanded={showExperienceTooltip}
                    aria-controls={experienceTooltipId}
                >
                    <span className="text-lg font-bold">?</span>
                </button>
                {showExperienceTooltip && (
                    <div 
                        id={experienceTooltipId}
                        className="absolute z-20 w-80 p-4 mt-2 text-sm text-white bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-xl right-0 sm:left-1/2 sm:-translate-x-1/2 border border-slate-600/50"
                        onClick={() => setShowExperienceTooltip(false)}
                        role="tooltip">
                    Selecciona tu familiaridad con la navegación para determinar si necesitas un patrón.
                    </div>
                )}
            </div>
      </div>
      
      {showBoatingLicenseField && (
        <SelectField
          label="Titulación Náutica"
          id="boatingLicense"
          value={data.boatingLicense || ''}
          onChange={(e) => updateData({ boatingLicense: e.target.value as BoatingLicenseType })}
          options={[{value: '', label: 'Selecciona tu titulación...'}, ...boatingLicenseTypeOptions.filter(opt => opt.value !== BoatingLicenseType.NO_LICENSE)]}
          required={showBoatingLicenseField}
        />
      )}
    </div>
  );
};

export default Step3Crew;