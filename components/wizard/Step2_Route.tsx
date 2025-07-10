
import React, { useEffect } from 'react';
import { WizardStepProps, DesiredExperienceType } from '../../types';
import { DateField, InputField, RadioGroup, TextAreaField } from '../FormControls';
import { AutocompleteInputField } from '../AutocompleteInputField';
import { worldPorts } from '../../data/ports';

const Step2Route: React.FC<WizardStepProps> = ({ data, updateData, isPrimaryInputDisabled, onReconsiderCookies }) => {

  const getDestinationLabel = () => {
    if (data.desiredExperienceType === DesiredExperienceType.TRANSFER) return "Puerto de Origen";
    if (data.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
      return data.isSamePortForMultiDay ? "Puerto de Salida y Llegada" : "Puerto de Salida";
    }
    return "Puerto de Salida";
  };
  
  useEffect(() => {
    if (data.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
      if (data.startDate && data.numTripDays && data.numTripDays >= 2) {
        try {
          const start = new Date(data.startDate);
          if (isNaN(start.getTime())) {
            updateData({ endDate: '' });
            return;
          }
          const end = new Date(start);
          end.setDate(start.getDate() + data.numTripDays - 1);
          updateData({ endDate: end.toISOString().slice(0, 10) });
        } catch (error) {
          console.error("Error calculating end date:", error);
          updateData({ endDate: '' });
        }
      } else {
        updateData({ endDate: '' });
      }
    } else {
      updateData({ endDate: '' });
    }
  }, [data.desiredExperienceType, data.startDate, data.numTripDays]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8 rounded-2xl border border-blue-100/50 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
          Ruta y Fechas
        </h2>
        <p className="text-lg text-slate-600 font-medium">¿Desde dónde zarpamos y cuándo?</p>
      </div>

      <div className="space-y-6">
        <div>
          <AutocompleteInputField
            label={getDestinationLabel()}
            id="destination"
            value={data.destination}
            onChange={(value) => updateData({ destination: value })}
            suggestions={worldPorts}
            placeholder={data.desiredExperienceType === DesiredExperienceType.TRANSFER ? "Ej: Port de Denia (Denia, Spain)" : "Ej: Port de Palma (Palma de Mallorca, Spain)"}
            required
            disabled={isPrimaryInputDisabled}
          />
          {isPrimaryInputDisabled && (
              <div className="mt-3 text-sm text-slate-600 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200/50 shadow-sm">
                <span>La funcionalidad completa requiere el consentimiento. Para habilitar este campo, puedes {' '}</span>
                <button
                  type="button"
                  onClick={onReconsiderCookies}
                  className="text-amber-600 hover:text-amber-700 font-semibold underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg transition-colors"
                >
                  gestionar preferencias
                </button>
                <span>.</span>
              </div>
          )}
        </div>
        
        <DateField
          label="Fecha de Inicio"
          id="startDate"
          value={data.startDate || ''}
          onChange={(e) => updateData({ startDate: e.target.value })}
          required
        />

        {data.desiredExperienceType === DesiredExperienceType.MULTI_DAY && (
          <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100/50 shadow-sm">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent -mb-2">Detalles del Viaje de Varios Días</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Número de Días del Viaje"
                    id="numTripDays"
                    type="number"
                    value={data.numTripDays && data.numTripDays > 0 ? data.numTripDays.toString() : ''}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateData({ numTripDays: isNaN(val) ? 0 : val });
                    }}
                    onBlur={() => {
                        if (data.numTripDays && data.numTripDays < 2) {
                            updateData({ numTripDays: 2 });
                        }
                    }}
                    min="2" 
                    required
                    placeholder="Mínimo 2 días"
                />
                <DateField
                    label="Fecha de Fin (Calculada)"
                    id="endDate"
                    value={data.endDate || ''}
                    disabled 
                    min={data.startDate} 
                />
            </div>
            <RadioGroup
                label="Logística de Puertos"
                name="portLogistics"
                selectedValue={data.isSamePortForMultiDay ? 'true' : 'false'}
                onChange={(selectedValueString) => {
                const newIsSamePort = selectedValueString === 'true';
                const updates: Partial<typeof data> = { isSamePortForMultiDay: newIsSamePort };
                if (newIsSamePort) {
                    updates.arrivalPortForMultiDay = '';
                }
                updateData(updates);
                }}
                options={[
                { value: 'true', label: `Mismo puerto (${(data.destination || 'Principal').split('(')[0].trim()})` },
                { value: 'false', label: 'Puerto de llegada diferente' },
                ]}
            />
            {!data.isSamePortForMultiDay && (
                <AutocompleteInputField
                    label="Puerto de Llegada"
                    id="arrivalPortMultiDay"
                    value={data.arrivalPortForMultiDay || ''}
                    onChange={(value) => updateData({ arrivalPortForMultiDay: value })}
                    suggestions={worldPorts}
                    placeholder="Ej: Marina Ibiza (Ibiza, Spain)"
                    required
                    disabled={isPrimaryInputDisabled}
                />
            )}
            <TextAreaField
                label="Notas para el Viaje de Varios Días (Opcional)"
                id="multiDayTripNotes"
                value={data.multiDayTripNotes || ''}
                onChange={(e) => updateData({ multiDayTripNotes: e.target.value })}
                placeholder="Ej: Preferimos fondeos tranquilos, evitar puertos grandes, etc."
                rows={2}
            />
          </div>
        )}

        {data.desiredExperienceType === DesiredExperienceType.TRANSFER && (
            <AutocompleteInputField
                label="Puerto de Destino del Traslado"
                id="transferDestinationPort"
                value={data.transferDestinationPort || ''}
                onChange={(value) => updateData({ transferDestinationPort: value })}
                suggestions={worldPorts}
                placeholder="Ej: Marina Ibiza (Ibiza, Spain)"
                required
                disabled={isPrimaryInputDisabled}
            />
        )}
      </div>
    </div>
  );
};

export default Step2Route;