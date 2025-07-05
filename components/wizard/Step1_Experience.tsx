import React from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType, planningModeOptions, desiredExperienceTypeOptions } from '../../types';
import { RadioGroup, SelectField } from '../FormControls';
import { GuidanceSailIcon } from '../icons/GuidanceSailIcon';
import { WindIcon } from '../icons/WindIcon';

const Step1Experience: React.FC<WizardStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center">
            <GuidanceSailIcon className="mx-auto h-12 w-12 text-teal-500" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mt-2">¡Comencemos tu Aventura Náutica!</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4">Cuéntanos qué tipo de experiencia en el mar estás buscando para crear tu plan perfecto.</p>
        </div>

        <div className="space-y-6 rounded-lg bg-slate-50 p-6 border border-slate-200">
            <div>
                <RadioGroup
                    label="¿Cómo quieres planificar tu viaje?"
                    name="planningMode"
                    selectedValue={data.planningMode}
                    onChange={(value) => updateData({ planningMode: value as PlanningMode })}
                    options={planningModeOptions}
                />
                <p className="text-xs text-slate-500 mt-2">Elige si quieres alquilar un barco o usar tu propia embarcación</p>
            </div>

            <div>
                <SelectField
                    label="Tipo de Experiencia que Deseas"
                    id="desiredExperienceType"
                    value={data.desiredExperienceType}
                    onChange={(e) => {
                        const newType = e.target.value as DesiredExperienceType;
                        const updates: Partial<typeof data> = { desiredExperienceType: newType };
                        if (newType !== DesiredExperienceType.MULTI_DAY) {
                            updates.isSamePortForMultiDay = true;
                            updates.arrivalPortForMultiDay = '';
                            updates.endDate = ''; 
                            updates.multiDayTripNotes = ''; 
                        }
                        updateData(updates);
                    }}
                    options={desiredExperienceTypeOptions}
                    required
                    icon={<WindIcon className="w-5 h-5 text-secondary" />}
                />
                <p className="text-xs text-slate-500 mt-2">Desde un paseo de medio día hasta una aventura de varios días</p>
            </div>
        </div>
    </div>
  );
};

export default Step1Experience;