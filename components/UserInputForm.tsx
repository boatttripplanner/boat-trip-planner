
import React, { useState, useMemo } from 'react';
import { UserPreferences, PlanningMode, DesiredExperienceType, ExperienceLevel, CookieConsentStatus, UserInputFormProps } from '../types';
import { Button } from './Button';
import ProgressStepper from './wizard/ProgressStepper';
import Step1Experience from './wizard/Step1_Experience';
import Step2Route from './wizard/Step2_Route';
import Step3Crew from './wizard/Step3_Crew';
import Step4Preferences from './wizard/Step4_Preferences';
import Step5BoatDetails from './wizard/Step5_BoatDetails';
import Step6Review from './wizard/Step6_Review';
import WizardNavigation from './wizard/WizardNavigation';

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading, cookieConsent, onReconsiderCookies }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<UserPreferences>({
    planningMode: PlanningMode.RENTAL,
    desiredExperienceType: DesiredExperienceType.FULL_DAY,
    destination: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    numTripDays: 2,
    isSamePortForMultiDay: true,
    arrivalPortForMultiDay: '',
    multiDayTripNotes: '',
    transferDestinationPort: '',
    numPeople: 2,
    experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
    boatingLicense: undefined,
    budgetLevel: undefined,
    customBudgetAmount: undefined,
    budgetNotes: '',
    activities: [],
    otherActivities: '',
    boatTransferDetails: {},
  });

  const [formError, setFormError] = useState<string | null>(null);

  const isPrimaryInputDisabled = cookieConsent !== CookieConsentStatus.ACCEPTED;

  const showBoatSpecsStep = useMemo(() => {
    return (
      formData.desiredExperienceType === DesiredExperienceType.TRANSFER ||
      formData.planningMode === PlanningMode.OWN_BOAT ||
      formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER ||
      formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE
    );
  }, [formData.desiredExperienceType, formData.planningMode, formData.experience]);

  const stepDetails = useMemo(() => {
    const steps = [
      { name: 'Experiencia' },
      { name: 'Ruta' },
      { name: 'Tripulación' },
      { name: 'Preferencias' },
    ];
    if (showBoatSpecsStep) {
      steps.push({ name: 'Barco' });
    }
    steps.push({ name: 'Revisar' });
    return steps;
  }, [showBoatSpecsStep]);

  const totalSteps = stepDetails.length;
  
  const updateFormData = (fields: Partial<UserPreferences>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    setFormError(null);
    // Step validation logic
    if (currentStep === 1) { // Experiencia
       // No mandatory fields here to validate
    } else if (currentStep === 2) { // Ruta
        if (!formData.destination.trim()) {
            setFormError(formData.desiredExperienceType === DesiredExperienceType.TRANSFER ? "Por favor, introduce el puerto de origen." : "Por favor, introduce el puerto de salida.");
            return;
        }
        if (formData.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
            if (!formData.numTripDays || formData.numTripDays < 2) {
                setFormError("Para 'Varios Días', el número de días debe ser al menos 2.");
                return;
            }
            if(!formData.isSamePortForMultiDay && !(formData.arrivalPortForMultiDay ?? '').trim()) {
                setFormError("Por favor, introduce el puerto de llegada para tu viaje.");
                return;
            }
        }
        if (formData.desiredExperienceType === DesiredExperienceType.TRANSFER && !(formData.transferDestinationPort ?? '').trim()) {
            setFormError("Por favor, introduce el puerto de destino para el traslado.");
            return;
        }
    } else if (currentStep === 3) { // Tripulación
        if (!formData.numPeople || formData.numPeople <= 0) {
            setFormError("El número de personas debe ser mayor que 0.");
            return;
        }
        const needsLicense = formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE || formData.planningMode === PlanningMode.OWN_BOAT;
        if (needsLicense && !formData.boatingLicense) {
            setFormError("Por favor, selecciona tu titulación náutica.");
            return;
        }
    } else if (currentStep === 4) { // Preferencias
      if (formData.budgetLevel === 'specific_amount' && (!formData.customBudgetAmount || formData.customBudgetAmount <= 0)) {
        setFormError("Por favor, introduce un monto de presupuesto válido.");
        return;
      }
    } else if (currentStep === 5 && showBoatSpecsStep) { // Barco
        const details = formData.boatTransferDetails;
        const requiredForOwnBoatOrTransfer = formData.planningMode === PlanningMode.OWN_BOAT || formData.desiredExperienceType === DesiredExperienceType.TRANSFER;
        if (requiredForOwnBoatOrTransfer) {
            if (!details?.model?.trim()) { setFormError("Por favor, introduce el modelo de tu barco."); return; }
            if (!details?.length?.trim()) { setFormError("Por favor, introduce la eslora de tu barco."); return; }
            if (!details?.beam?.trim()) { setFormError("Por favor, introduce la manga de tu barco."); return; }
            if (!details?.draft?.trim()) { setFormError("Por favor, introduce el calado de tu barco."); return; }
            if (!details?.cruisingSpeed?.trim()) { setFormError("Por favor, introduce la velocidad de crucero."); return; }
            if (!details?.tankCapacity?.trim()) { setFormError("Por favor, introduce la capacidad del depósito."); return; }
            if (!details?.averageConsumption?.trim()) { setFormError("Por favor, introduce el consumo medio."); return; }
        }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const renderStep = () => {
      let stepComponent;
      const stepProps = {
        data: formData,
        updateData: updateFormData,
        isPrimaryInputDisabled: isPrimaryInputDisabled,
        onReconsiderCookies: onReconsiderCookies,
      };

      const stepConfig = [
        { condition: true, component: <Step1Experience {...stepProps} /> },
        { condition: true, component: <Step2Route {...stepProps} /> },
        { condition: true, component: <Step3Crew {...stepProps} /> },
        { condition: true, component: <Step4Preferences {...stepProps} /> },
        { condition: showBoatSpecsStep, component: <Step5BoatDetails {...stepProps} /> },
        { condition: true, component: <Step6Review data={formData} goToStep={goToStep} showBoatSpecsStep={showBoatSpecsStep} /> },
      ];

      let effectiveStepIndex = 0;
      let targetStepReached = false;
      for(let i=0; i < stepConfig.length && !targetStepReached; i++){
        if(stepConfig[i].condition){
          effectiveStepIndex++;
          if(effectiveStepIndex === currentStep){
            stepComponent = stepConfig[i].component;
            targetStepReached = true;
          }
        }
      }
      return stepComponent || <div>Paso no encontrado</div>;
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-8 w-full border border-slate-200" aria-labelledby="form-title">
      <h2 id="form-title" className="text-3xl sm:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-lg">
        Planifica tu viaje en barco
      </h2>
      <div aria-live="polite" className="min-h-[1.5em] text-red-600 font-semibold mb-2">{formError}</div>
      <ProgressStepper steps={stepDetails.map(s => s.name)} currentStep={currentStep} />
      <div className="mt-8 transition-all duration-300">
          {renderStep()}
      </div>

        {currentStep < totalSteps ? (
            <WizardNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onBack={handleBack}
                isLoading={isLoading}
            />
        ) : (
             <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                <Button type="button" onClick={handleBack} variant="secondary">
                    &larr; Atrás
                </Button>
                <Button type="submit" disabled={isLoading || isPrimaryInputDisabled} className="w-auto animate-subtle-pulse disabled:animate-none">
                    {isLoading ? 'Trazando Rumbo...' : 'Obtener Recomendaciones'}
                </Button>
            </div>
        )}
    </form>
  );
};

export default UserInputForm;