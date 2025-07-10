
import React from 'react';
import { UserPreferences, desiredExperienceTypeOptions, experienceLevelOptions, planningModeOptions } from '../../types';
import { budgetLevelOptions } from '../../constants';
import { Button } from '../Button';

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
    <div className="py-2">
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      {value ? <p className="text-lg text-slate-800 font-bold">{value}</p> : children}
    </div>
  );
};


const SectionBlock: React.FC<{title: string, onEdit: () => void, children: React.ReactNode}> = ({ title, onEdit, children }) => {
    return (
        <div className="border-b border-slate-200 pb-6 mb-6 last:border-b-0 last:mb-0">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">{title}</h3>
                <Button type="button" onClick={onEdit} variant="secondary" size="sm">Editar</Button>
            </div>
            <div className="pl-4">
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
    <div className="space-y-8 animate-fade-in">
      <div className="text-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl border border-green-100/50 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
          Revisa tu Plan
        </h2>
        <p className="text-lg text-slate-600 font-medium">Confirma que todos los detalles de tu aventura soñada son correctos.</p>
      </div>

      <div className="space-y-6 p-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl border border-slate-200/50 shadow-sm">
        
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