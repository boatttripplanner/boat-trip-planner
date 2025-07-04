"use client";
import { WizardProvider } from "@/components/wizard/WizardContext";
import WizardSteps from "@/components/wizard/WizardSteps";

export default function WizardPage() {
  return (
    <WizardProvider>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-200 px-4 py-8">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-xl p-6">
          <WizardSteps />
        </div>
      </main>
    </WizardProvider>
  );
} 