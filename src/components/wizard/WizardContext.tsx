import React, { createContext, useContext, useState, ReactNode } from "react";

export type WizardData = {
  destination?: string;
  dates?: { start: string; end: string };
  boatType?: string;
  interests?: string[];
};

interface WizardContextProps {
  step: number;
  data: WizardData;
  nextStep: () => void;
  prevStep: () => void;
  setData: (data: Partial<WizardData>) => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [data, setWizardData] = useState<WizardData>({});

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const setData = (d: Partial<WizardData>) => setWizardData((prev) => ({ ...prev, ...d }));
  const reset = () => { setStep(1); setWizardData({}); };

  return (
    <WizardContext.Provider value={{ step, data, nextStep, prevStep, setData, reset }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}; 