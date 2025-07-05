"use client";
import { useState } from "react";
import { WizardProvider } from "../components/wizard/WizardContext";
import WizardSteps from "../components/wizard/WizardSteps";
import TripCard, { Trip } from "../components/TripCard";
import FloatingChat from '../components/FloatingChat';

export default function Home() {
  const [result, setResult] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esta función será llamada desde el último paso del wizard
  const handleGenerate = async (data: Trip) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/generateTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const trip = await res.json();
      
      if (trip.error) {
        throw new Error(trip.error);
      }
      
      setResult(trip);
    } catch (error) {
      console.error('Error generating trip:', error);
      setError(error instanceof Error ? error.message : 'Error al generar la recomendación. Por favor, inténtalo de nuevo.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <WizardProvider>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-200 px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-xl p-4 sm:p-6">
          {!result && !loading && !error && (
            <WizardSteps onGenerate={handleGenerate} />
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12" role="status" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-cyan-700 border-opacity-50" aria-hidden="true"></div>
              <span className="text-cyan-700 font-bold text-base sm:text-lg text-center">Generando tu recomendación personalizada...</span>
              <p className="text-cyan-600 text-xs sm:text-sm text-center">Esto puede tomar unos segundos mientras analizamos tu destino y preferencias</p>
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12 text-center">
              <div className="text-red-500 text-3xl sm:text-4xl mb-2">⚠️</div>
              <h2 className="text-red-700 font-bold text-base sm:text-lg">Error al generar recomendación</h2>
              <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>
              <button 
                onClick={handleReset} 
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                aria-label="Volver al formulario para intentar de nuevo"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
          {result && !loading && !error && (
            <div>
              <TripCard trip={result} />
              <button 
                onClick={handleReset} 
                className="mt-4 sm:mt-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
                aria-label="Crear una nueva recomendación de viaje"
              >
                ✨ Crear nueva recomendación
              </button>
            </div>
          )}
        </div>
        <FloatingChat />
      </main>
    </WizardProvider>
  );
}
