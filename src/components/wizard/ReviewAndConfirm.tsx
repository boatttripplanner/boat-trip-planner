import { useWizard } from "./WizardContext";
import { useState } from "react";
import TripCard, { Trip } from "../TripCard";

interface ReviewAndConfirmProps {
  onGenerate?: (data: Trip) => void;
}

export default function ReviewAndConfirm({ onGenerate }: ReviewAndConfirmProps) {
  const { data, prevStep, reset } = useWizard();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Trip | { error: string } | null>(null);

  const handleGenerate = async () => {
    if (onGenerate) {
      onGenerate(data as Trip);
      return;
    }
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
      setResult({ error: "Error generando el viaje" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-cyan-800">Revisa tu selección</h2>
      <ul className="text-cyan-700 text-base">
        <li><b>Destino:</b> {data.destination}</li>
        <li><b>Fechas:</b> {data.dates?.start} - {data.dates?.end}</li>
        <li><b>Barco:</b> {data.boatType}</li>
        <li><b>Intereses:</b> {(data.interests || []).join(", ")}</li>
      </ul>
      <div className="flex gap-2">
        <button onClick={prevStep} className="bg-gray-200 text-cyan-700 font-bold py-2 px-4 rounded-lg">Atrás</button>
        <button onClick={handleGenerate} disabled={loading} className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded-lg">
          {loading ? "Generando..." : "Generar recomendación"}
        </button>
        <button onClick={reset} className="bg-gray-100 text-cyan-500 font-bold py-2 px-4 rounded-lg">Reiniciar</button>
      </div>
      {!onGenerate && result && (
        <div className="mt-4">
          {/* Aquí se mostrará el TripCard con el resultado */}
          {typeof result === 'object' && result !== null && 'error' in result ? (
            <div className="text-red-500">{(result as { error: string }).error}</div>
          ) : result ? (
            <TripCard trip={result as Trip} />
          ) : null}
        </div>
      )}
    </div>
  );
} 