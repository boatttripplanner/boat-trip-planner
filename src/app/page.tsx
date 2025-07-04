"use client";
import { useState } from "react";
import { WizardProvider } from "../components/wizard/WizardContext";
import WizardSteps from "../components/wizard/WizardSteps";
import TripCard, { Trip } from "../components/TripCard";
import FloatingChat from '../components/FloatingChat';

export default function Home() {
  const [result, setResult] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  // Esta función será llamada desde el último paso del wizard
  const handleGenerate = async (data: Trip) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generateTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const trip = await res.json();
      setResult(trip);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLoading(false);
  };

  return (
    <WizardProvider>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-200 px-4 py-8">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-xl p-6">
          {!result && !loading && (
            <WizardSteps onGenerate={handleGenerate} />
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-700 border-opacity-50"></div>
              <span className="text-cyan-700 font-bold text-lg">Generando tu recomendación...</span>
            </div>
          )}
          {result && !loading && (
            <div>
              <TripCard trip={result} />
              <button onClick={handleReset} className="mt-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-6 rounded-lg">Nueva recomendación</button>
            </div>
          )}
        </div>
        <FloatingChat />
      </main>
    </WizardProvider>
  );
}
