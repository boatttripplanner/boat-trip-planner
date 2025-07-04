"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Itinerary from "@/components/Itinerary";
import Weather from "@/components/Weather";
import Gallery from "@/components/Gallery";
import Affiliates from "@/components/Affiliates";
import PremiumNotice from "@/components/PremiumNotice";
import AnimatedSection from "@/components/AnimatedSection";

interface WeatherDay {
  day: string;
  temp: number;
  desc: string;
}

interface AmazonProduct {
  title: string;
  url: string;
  image: string;
  price: string;
}

interface TripData {
  destino: string;
  itinerary: string;
  weather: WeatherDay[];
  images: string[];
  amazon: AmazonProduct[];
  samBoat: string;
}

export default function DestinoClient() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const destino = slug.replace(/-/g, ' ');
  const [data, setData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const isPremiumUser = false; // Simulación, cambiar por lógica real en el futuro

  useEffect(() => {
    if (!destino) return;
    setLoading(true);
    fetch(`/api/generateTrip?destino=${encodeURIComponent(destino)}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [destino]);

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10 text-cyan-600">Cargando información del destino...</div>;
  }
  if (!data) {
    return <div className="max-w-2xl mx-auto mt-10 text-cyan-600">No se pudo cargar la información del destino.</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-200 flex flex-col items-center justify-start px-4" role="main">
      <article className="max-w-2xl w-full mt-10 p-6 bg-white/90 rounded-xl shadow-lg" aria-label={`Información de navegación para ${destino}`}> 
        <AnimatedSection delay={0}>
          <h2 className="text-3xl font-bold text-cyan-800 mb-2 capitalize">{destino}</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <PremiumNotice isPremiumUser={isPremiumUser} />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <Itinerary text={data.itinerary} />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <Weather days={data.weather} />
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          <Gallery images={data.images} />
        </AnimatedSection>
        <AnimatedSection delay={0.5}>
          <Affiliates amazon={data.amazon} samBoat={data.samBoat} />
        </AnimatedSection>
      </article>
    </main>
  );
} 