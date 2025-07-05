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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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
    const newErrors: { [key: string]: string } = {};
    setGeneralError(null);

    if (currentStep === 1) {
      // No mandatory fields here to validate
    } else if (currentStep === 2) {
      if (!formData.destination.trim()) {
        newErrors.destination = formData.desiredExperienceType === DesiredExperienceType.TRANSFER ? "Por favor, introduce el puerto de origen." : "Por favor, introduce el puerto de salida.";
      }
      if (formData.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
        if (!formData.numTripDays || formData.numTripDays < 2) {
          newErrors.numTripDays = "Para 'Varios Días', el número de días debe ser al menos 2.";
        }
        if (!formData.isSamePortForMultiDay && !(formData.arrivalPortForMultiDay ?? '').trim()) {
          newErrors.arrivalPortForMultiDay = "Por favor, introduce el puerto de llegada para tu viaje.";
        }
      }
      if (formData.desiredExperienceType === DesiredExperienceType.TRANSFER && !(formData.transferDestinationPort ?? '').trim()) {
        newErrors.transferDestinationPort = "Por favor, introduce el puerto de destino para el traslado.";
      }
    } else if (currentStep === 3) {
      if (!formData.numPeople || formData.numPeople <= 0) {
        newErrors.numPeople = "El número de personas debe ser mayor que 0.";
      }
      const needsLicense = formData.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || formData.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE || formData.planningMode === PlanningMode.OWN_BOAT;
      if (needsLicense && !formData.boatingLicense) {
        newErrors.boatingLicense = "Por favor, selecciona tu titulación náutica.";
      }
    } else if (currentStep === 4) {
      if (formData.budgetLevel === 'specific_amount' && (!formData.customBudgetAmount || formData.customBudgetAmount <= 0)) {
        newErrors.customBudgetAmount = "Por favor, introduce un monto de presupuesto válido.";
      }
    } else if (currentStep === 5 && showBoatSpecsStep) {
      const details = formData.boatTransferDetails;
      const requiredForOwnBoatOrTransfer = formData.planningMode === PlanningMode.OWN_BOAT || formData.desiredExperienceType === DesiredExperienceType.TRANSFER;
      if (requiredForOwnBoatOrTransfer) {
        if (!details?.model?.trim()) { newErrors.model = "Por favor, introduce el modelo de tu barco."; }
        if (!details?.length?.trim()) { newErrors.length = "Por favor, introduce la eslora de tu barco."; }
        if (!details?.beam?.trim()) { newErrors.beam = "Por favor, introduce la manga de tu barco."; }
        if (!details?.draft?.trim()) { newErrors.draft = "Por favor, introduce el calado de tu barco."; }
        if (!details?.cruisingSpeed?.trim()) { newErrors.cruisingSpeed = "Por favor, introduce la velocidad de crucero."; }
        if (!details?.tankCapacity?.trim()) { newErrors.tankCapacity = "Por favor, introduce la capacidad del depósito."; }
        if (!details?.averageConsumption?.trim()) { newErrors.averageConsumption = "Por favor, introduce el consumo medio."; }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setGeneralError("Por favor, corrige los errores antes de continuar.");
      return;
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
    <form onSubmit={handleSubmit} className="card bg-white border border-border rounded-xl max-w-2xl mx-auto p-4 sm:p-6 md:p-8" style={{position:'relative', zIndex:5}}>
        <ProgressStepper steps={stepDetails.map(s => s.name)} currentStep={currentStep} />
        {generalError && (
          <div className="mb-4">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md" role="alert">
              <div className="flex">
                <div className="py-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
                <div>
                  <p className="font-bold text-sm sm:text-base">Error</p>
                  <p className="text-xs sm:text-sm">{generalError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 sm:mt-6 transition-all duration-200">
          {React.cloneElement(renderStep(), { errors })}
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
             <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-border mt-4 sm:mt-6 gap-4">
                <Button type="button" onClick={handleBack} variant="secondary" className="px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold w-full sm:w-auto">
                    &larr; Atrás
                </Button>
                <Button type="submit" disabled={isLoading || isPrimaryInputDisabled} className="px-6 sm:px-7 py-2 text-sm sm:text-base font-semibold bg-primary text-white rounded-full w-full sm:w-auto">
                    {isLoading ? 'Trazando Rumbo...' : 'Obtener Recomendaciones'}
                </Button>
            </div>
        )}
    </form>
  );
};

export default UserInputForm;