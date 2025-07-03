
import React from 'react';
import { UserPreferences, desiredExperienceTypeOptions, experienceLevelOptions, planningModeOptions } from '../../types';
import { budgetLevelOptions } from '../../constants';
import { Button } from '../Button';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Step6ReviewProps {
  data: UserPreferences;
  goToStep: (step: number) => void;
  showBoatSpecsStep: boolean;
}

const ReviewItem: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => {
  if (value === undefined && !children) return null;
  const displayValue = value === null || value === undefined ? '' : String(value);
  if (displayValue.trim() === '' && !children) return null;
  
  return (
    <div className="py-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {value ? <p className="text-md text-slate-800 font-semibold">{value}</p> : children}
    </div>
  );
};


const SectionBlock: React.FC<{title: string, onEdit: () => void, children: React.ReactNode}> = ({ title, onEdit, children }) => {
    return (
        <div className="border-b pb-3 mb-3 last:border-b-0 last:mb-0">
             <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg text-slate-700">{title}</h3>
                <Button type="button" onClick={onEdit} variant="secondary" size="sm">Editar</Button>
            </div>
            <div className="pl-2">
                 {children}
            </div>
        </div>
    );
}

const Step6Review: React.FC<Step6ReviewProps> = ({ data, goToStep, showBoatSpecsStep }) => {
    
    const getDisplayValue = (options: {value: string, label: string}[], value?: string) => {
        return options.find(opt => opt.value === value)?.label || 'No especificado';
    };

    const boatStepNumber = 5;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-teal-500" />
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mt-2">Revisa tu Plan</h2>
        <p className="text-sm sm:text-base text-slate-600">Confirma que todos los detalles de tu aventura soñada son correctos.</p>
      </div>

      <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50/50">
        
        <SectionBlock title="Experiencia" onEdit={() => goToStep(1)}>
            <ReviewItem label="Modo" value={getDisplayValue(planningModeOptions, data.planningMode)} />
            <ReviewItem label="Tipo de Viaje" value={getDisplayValue(desiredExperienceTypeOptions, data.desiredExperienceType)} />
        </SectionBlock>

        <SectionBlock title="Ruta y Fechas" onEdit={() => goToStep(2)}>
            <ReviewItem label={data.desiredExperienceType === 'transfer' ? 'Origen' : 'Salida'} value={data.destination} />
            {data.desiredExperienceType === 'multi_day' && (
                <>
                    <ReviewItem label="Duración" value={`${data.numTripDays} días`} />
                    {!data.isSamePortForMultiDay && <ReviewItem label="Llegada" value={data.arrivalPortForMultiDay} />}
                </>
            )}
            {data.desiredExperienceType === 'transfer' && <ReviewItem label="Destino" value={data.transferDestinationPort} />}
            <ReviewItem label="Fecha de Inicio" value={data.startDate ? new Date(data.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'}) : ''} />
        </SectionBlock>

        <SectionBlock title="Tripulación" onEdit={() => goToStep(3)}>
            <ReviewItem label="Personas" value={data.numPeople} />
            <ReviewItem label="Experiencia" value={getDisplayValue(experienceLevelOptions, data.experience)} />
        </SectionBlock>

        <SectionBlock title="Preferencias" onEdit={() => goToStep(4)}>
            <ReviewItem label="Presupuesto" value={data.budgetLevel ? getDisplayValue(budgetLevelOptions, data.budgetLevel) : 'No especificado'} />
            {data.budgetLevel === 'specific_amount' && <ReviewItem label="Monto" value={`${data.customBudgetAmount?.toLocaleString('es-ES') || '0'} EUR`} />}
            {data.activities.length > 0 && <ReviewItem label="Actividades" value={data.activities.join(', ')} />}
        </SectionBlock>
        
        {showBoatSpecsStep && data.boatTransferDetails?.model && (
             <SectionBlock title="Detalles del Barco" onEdit={() => goToStep(boatStepNumber)}>
                <ReviewItem label="Modelo" value={data.boatTransferDetails?.model} />
                <ReviewItem label="Eslora" value={`${data.boatTransferDetails?.length || '?'} m`} />
            </SectionBlock>
        )}
      </div>
    </div>
  );
};

export default Step6Review;