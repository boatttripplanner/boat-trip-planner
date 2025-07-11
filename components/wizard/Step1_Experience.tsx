import React from 'react';
import { WizardStepProps, PlanningMode, DesiredExperienceType } from '../../types';
import { BoatOutlineIcon } from '../icons/BoatOutlineIcon';
import { KeyIcon } from '../icons/KeyIcon';
import { SunIcon } from '../icons/SunIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { SunsetIcon } from '../icons/SunsetIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { ArrowRightLeftIcon } from '../icons/ArrowRightLeftIcon';

// A new component for the clickable cards
const OptionCard: React.FC<{
  label: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, description, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-teal-200 focus:ring-offset-2 shadow-lg
        ${isSelected
          ? 'bg-gradient-to-br from-teal-400 via-cyan-300 to-sky-200 border-teal-500 shadow-2xl ring-2 ring-teal-300 animate-glow'
          : 'bg-white/90 border-slate-200 hover:border-teal-400 hover:shadow-xl'
        }`}
      style={{ transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s' }}
    >
      <div className="flex flex-col gap-1">
        <p className="font-bold text-lg text-slate-800 mb-1">{label}</p>
        {description && <p className="text-base text-slate-600">{description}</p>}
      </div>
    </button>
  );
};

const ExperienceTypeCard: React.FC<{
    label: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, isSelected, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group w-full p-4 text-center rounded-2xl border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-teal-200 focus:ring-offset-2 shadow-lg flex flex-col items-center justify-center h-full
                ${isSelected 
                    ? 'bg-gradient-to-br from-teal-400 via-cyan-300 to-sky-200 border-teal-500 shadow-2xl ring-2 ring-teal-300 animate-glow' 
                    : 'bg-white/90 border-slate-200 hover:border-teal-400 hover:shadow-xl'
                }`}
            style={{ transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s' }}
        >
            <p className="font-bold text-base text-slate-800">{label}</p>
        </button>
    );
};

const experienceIcons: { [key in DesiredExperienceType]: React.ReactNode } = {
  [DesiredExperienceType.FULL_DAY]: <SunIcon className="w-5 h-5" />,
  [DesiredExperienceType.HALF_DAY_MORNING]: <ClockIcon className="w-5 h-5" />,
  [DesiredExperienceType.HALF_DAY_AFTERNOON]: <ClockIcon className="w-5 h-5" />,
  [DesiredExperienceType.SUNSET]: <SunsetIcon className="w-5 h-5" />,
  [DesiredExperienceType.MULTI_DAY]: <CalendarDaysIcon className="w-5 h-5" />,
  [DesiredExperienceType.TRANSFER]: <ArrowRightLeftIcon className="w-5 h-5" />,
};

const experienceOptions = [
    { value: DesiredExperienceType.FULL_DAY, label: 'Día Completo' },
    { value: DesiredExperienceType.MULTI_DAY, label: 'Varios Días' },
    { value: DesiredExperienceType.HALF_DAY_MORNING, label: 'Medio Día/Mañana' },
    { value: DesiredExperienceType.HALF_DAY_AFTERNOON, label: 'Medio Día/Tarde' },
    { value: DesiredExperienceType.SUNSET, label: 'Puesta de Sol' },
    { value: DesiredExperienceType.TRANSFER, label: 'Traslado' },
];

const Step1Experience: React.FC<WizardStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">¡Bienvenido a Bordo!</h2>
        <p className="text-base text-slate-600 mt-1">Para empezar, cuéntanos un poco sobre el viaje que tienes en mente.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">1. ¿Cuál es tu plan?</h3>
        <div className="space-y-3">
          <OptionCard
            label="Quiero Alquilar un Barco"
            description="Buscaremos el barco perfecto para ti."
            isSelected={data.planningMode === PlanningMode.RENTAL}
            onClick={() => updateData({ planningMode: PlanningMode.RENTAL })}
          />
          <OptionCard
            label="Tengo mi Propio Barco"
            description="Planificaremos la ruta ideal para tu embarcación."
            isSelected={data.planningMode === PlanningMode.OWN_BOAT}
            onClick={() => updateData({ planningMode: PlanningMode.OWN_BOAT })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">2. ¿Qué tipo de experiencia buscas?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {experienceOptions.map(option => (
                 <ExperienceTypeCard 
                    key={option.value}
                    label={option.label}
                    isSelected={data.desiredExperienceType === option.value}
                    onClick={() => {
                        const newType = option.value;
                        const updates: Partial<typeof data> = { desiredExperienceType: newType };
                        if (newType !== DesiredExperienceType.MULTI_DAY) {
                            updates.isSamePortForMultiDay = true;
                            updates.arrivalPortForMultiDay = '';
                            updates.endDate = '';
                            updates.multiDayTripNotes = '';
                            updates.numTripDays = undefined; // Limpiar número de días si no es multi_day
                        }
                        updateData(updates);
                    }}
                 />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Experience;
