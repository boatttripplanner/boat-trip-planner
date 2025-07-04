interface ItineraryProps {
  text: string | null;
}

export default function Itinerary({ text }: ItineraryProps) {
  if (!text) return null;
  return (
    <section className="mb-8">
      <h3 className="text-2xl font-bold text-cyan-800 mb-2">Itinerario sugerido</h3>
      <p className="text-cyan-700 whitespace-pre-line bg-cyan-50 rounded-lg p-4 shadow-inner">{text}</p>
    </section>
  );
} 