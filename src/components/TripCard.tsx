import { motion } from "framer-motion";
import Image from "next/image";
import { FiMap, FiImage, FiStar, FiExternalLink, FiUser, FiShoppingBag, FiShield } from "react-icons/fi";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaShip, FaStar as FaStarSolid, FaMapMarkedAlt, FaCloudSun, FaCameraRetro, FaCrown, FaSyncAlt } from 'react-icons/fa';

export interface Trip {
  destination: string;
  dates: { start: string; end: string };
  boatType: string;
  interests: string[];
  description?: string;
  weather?: {
    Day?: {
      Icon?: number;
      IconPhrase?: string;
    };
    Temperature?: {
      Maximum?: { Value?: number };
      Minimum?: { Value?: number };
    };
  };
  image?: string;
  itinerary?: string;
  weatherTips?: string;
  recommendedStops?: string;
  practicalTips?: string;
  captainTips?: string;
  experience?: string;
  [key: string]: unknown;
}

interface TripCardProps {
  trip: Trip;
  isPremium?: boolean;
}

const boatIcons: Record<string, string> = {
  sailboat: "⛵️",
  catamaran: "🛥️",
  motorboat: "🚤",
  yacht: "🛳️",
};

function Accordion({ sections }: { sections: { title: string; icon?: React.ReactNode; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-cyan-100">
      {sections.map((section, idx) => (
        <div key={idx}>
          <button
            className="w-full flex items-center justify-between py-4 px-6 bg-white hover:bg-cyan-50 transition rounded-none focus:outline-none"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
          >
            <span className="flex items-center gap-2 font-semibold text-cyan-700 text-base">{section.icon}{section.title}</span>
            <span className="text-cyan-400 text-xl">{open === idx ? "−" : "+"}</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open === idx ? 'max-h-[1000px] py-2 px-6' : 'max-h-0 px-6 py-0'}`}
            style={{ background: open === idx ? '#f0f9fa' : 'transparent' }}
          >
            {open === idx && section.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TripCard({ trip, isPremium }: TripCardProps) {
  const boatIcon = boatIcons[trip.boatType] || "🚤";
  // Calcular duración
  const duration = trip.dates?.start && trip.dates?.end ? daysBetween(trip.dates.start, trip.dates.end) : null;

  // Galería de imágenes
  const gallery: string[] = Array.isArray(trip.gallery) ? trip.gallery : [];

  // Itinerario: intentar parsear a array de días si es posible
  let itineraryDays: { day: string; text: string }[] = [];
  if (typeof trip.itinerary === "string") {
    // Buscar líneas tipo "Día X: ..."
    const regex = /D[ií]a\s*([0-9]+)\s*[:\-]\s*([\s\S]*?)(?=\nD[ií]a|$)/gi;
    let match;
    while ((match = regex.exec(trip.itinerary)) !== null) {
      itineraryDays.push({ day: `Día ${match[1]}`, text: match[2].trim() });
    }
    // Si no hay matches, mostrar como un solo bloque
    if (itineraryDays.length === 0 && trip.itinerary) {
      itineraryDays = [{ day: "Itinerario", text: trip.itinerary }];
    }
  }

  // Clima: array de días
  const weatherDays = Array.isArray(trip.weather) ? trip.weather : [];

  // Checklist interactivo: detectar listas en practicalTips
  const checklistItems = typeof trip.practicalTips === "string"
    ? trip.practicalTips.split(/\n|•|\-/).map(s => s.trim()).filter(s => s.length > 2)
    : [];
  const [checked, setChecked] = useState<boolean[]>(Array(checklistItems.length).fill(false));
  const handleCheck = (idx: number) => setChecked(c => c.map((v, i) => i === idx ? !v : v));

  // Secciones para el acordeón
  const sections = [
    {
      title: "Itinerario diario",
      icon: <FiMap className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col gap-2">
          {itineraryDays.length > 0 ? itineraryDays.map((dia, idx) => (
            <div key={idx} className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
              <div className="font-semibold text-cyan-700 mb-1">{dia.day}</div>
              <ReactMarkdown components={{
                p: (props) => <p className="text-cyan-800 text-sm whitespace-pre-line" {...props} />,
                ul: (props) => <ul className="list-disc pl-6 text-cyan-800 text-sm" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
                strong: (props) => <strong className="text-cyan-900 font-semibold" {...props} />,
                h3: (props) => <h3 className="text-cyan-700 font-bold text-lg mt-4 mb-2" {...props} />,
              }}>{dia.text}</ReactMarkdown>
            </div>
          )) : <div className="text-cyan-600 text-sm">No hay itinerario disponible.</div>}
        </div>
      ),
    },
    {
      title: "Resumen del clima",
      icon: <FiImage className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col gap-2">
          {weatherDays.length > 0 ? weatherDays.map((w, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-cyan-50 rounded-lg p-3 border border-cyan-100">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="font-semibold text-cyan-700">Día {idx + 1}: {w.Temperature?.Maximum?.Value}°C / {w.Temperature?.Minimum?.Value}°C, {w.Day?.IconPhrase}</div>
                <div className="text-cyan-600 text-sm">{w.Day?.LongPhrase || "Sin alertas meteorológicas"}</div>
              </div>
            </div>
          )) : <div className="text-cyan-600 text-sm">No hay datos meteorológicos.</div>}
        </div>
      ),
    },
    {
      title: "Mapa de ruta",
      icon: <FiMap className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col items-center gap-2">
          {typeof trip.mapUrl === 'string' && trip.mapUrl ? (
            <Image src={trip.mapUrl} alt="Mapa de ruta" width={400} height={160} className="w-full h-40 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-40 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-400">[Mapa de ruta aquí]</div>
          )}
          <button className="flex items-center gap-1 text-cyan-700 hover:underline text-sm"><FiExternalLink className="w-4 h-4" />Ver en Google Maps</button>
        </div>
      ),
    },
    {
      title: "Galería de imágenes",
      icon: <FiImage className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="grid grid-cols-3 gap-2">
          {gallery.length > 0 ? gallery.filter(img => typeof img === 'string').map((img, i) => (
            <div key={i} className="aspect-square bg-cyan-100 rounded-lg overflow-hidden flex items-center justify-center">
              <Image src={img} alt={`Galería ${i + 1}`} width={100} height={100} className="object-cover w-full h-full" />
            </div>
          )) : Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-300">IMG</div>
          ))}
        </div>
      ),
    },
    ...(checklistItems.length > 0 ? [{
      title: "Checklist de viaje",
      icon: <FiStar className="w-5 h-5 text-cyan-400" />,
      content: (
        <ul className="flex flex-col gap-2">
          {checklistItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input type="checkbox" checked={checked[idx]} onChange={() => handleCheck(idx)} className="accent-cyan-600 w-5 h-5 rounded" />
              <span className={checked[idx] ? "line-through text-cyan-400" : "text-cyan-800"}>{item}</span>
            </li>
          ))}
        </ul>
      ),
    }] : []),
    {
      title: "Recomendaciones locales",
      icon: <FiStar className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col gap-2">
          {[1,2].map(i => (
            <div key={i} className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
              <div className="font-semibold text-cyan-700">Restaurante frente al mar</div>
              <div className="text-cyan-800 text-sm">Descripción breve de la experiencia local recomendada.</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Productos recomendados",
      icon: <FiShoppingBag className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1,2,3].map(i => (
            <div key={i} className="min-w-[120px] bg-cyan-50 rounded-lg p-2 border border-cyan-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-cyan-100 rounded mb-2 flex items-center justify-center text-cyan-300">IMG</div>
              <div className="text-xs text-cyan-800 font-semibold">Producto {i}</div>
              <a href="#" className="text-cyan-600 text-xs hover:underline mt-1">Ver en Amazon</a>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Alquila tu barco",
      icon: <FiUser className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-20 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-300">[Tarjeta de barco aquí]</div>
          <a href="#" className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-6 rounded-lg text-sm">Ver barcos en SamBoat</a>
        </div>
      ),
    },
    {
      title: "Tips del capitán",
      icon: <FiUser className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
            <div className="font-semibold text-cyan-700">Nivel recomendado: Intermedio</div>
            <div className="text-cyan-800 text-sm">Consejos de navegación, advertencias y normativas locales.</div>
          </div>
        </div>
      ),
    },
    ...(isPremium ? [{
      title: "Extras Premium",
      icon: <FiShield className="w-5 h-5 text-yellow-500" />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
            <div className="font-semibold text-yellow-700">Lugares secretos y experiencias VIP</div>
            <div className="text-yellow-800 text-sm">Acceso exclusivo a rutas y recomendaciones premium.</div>
          </div>
        </div>
      ),
    }] : []),
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl shadow-2xl p-0 flex flex-col gap-0 border border-cyan-100 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }}
    >
      {/* Imagen principal */}
      {trip.image && (
        <div className="relative w-full h-48" style={{ background: 'linear-gradient(90deg, #0a2540 0%, #1976d2 100%)' }}>
          <Image
            src={trip.image}
            alt={trip.destination}
            fill
            className="object-cover w-full h-full opacity-90"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute top-2 left-2 bg-white/80 rounded-full px-3 py-1 text-2xl shadow flex items-center gap-2">
            <FaShip className="text-blue-700" />
            {boatIcon}
          </div>
        </div>
      )}
      {/* Sello premium */}
      {isPremium && (
        <div className="flex items-center gap-2 px-6 pt-4 pb-2">
          <FaCrown className="w-6 h-6 text-yellow-500" />
          <span className="text-yellow-700 font-semibold text-sm">Recomendación Premium</span>
        </div>
      )}
      {/* Resumen general */}
      <div className="p-6 flex flex-col gap-2 border-b border-cyan-100" style={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #f0f9fa 100%)', fontWeight: 600 }}>
        <div className="flex items-center gap-2 text-cyan-800 text-2xl font-bold">
          <FaMapMarkedAlt className="w-7 h-7 text-blue-500" />
          {trip.destination}
        </div>
        <div className="text-cyan-700 text-base flex flex-wrap gap-2 items-center">
          <FaCloudSun className="w-5 h-5 inline-block mr-1 text-blue-400" />
          {trip.dates?.start} - {trip.dates?.end}
          {duration && <span className="ml-2">({duration} días)</span>}
          <span className="ml-4"><b>Barco:</b> <FaShip className="inline-block text-blue-700 mr-1" /> {boatIcon} {trip.boatType}</span>
        </div>
        <div className="text-cyan-700 text-base">
          <b>Intereses:</b> {(trip.interests || []).join(", ")}
        </div>
        <div className="text-cyan-800 italic mt-2">Tu viaje de {duration || "X"} días en {trip.boatType} por {trip.destination}. Enfocado en {(trip.interests || []).join(", ")}.</div>
        <div className="flex gap-2 mt-3">
          <button className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm transition-all"><FaStarSolid className="w-4 h-4" />Editar viaje</button>
        </div>
      </div>
      {/* Acordeón de secciones */}
      <Accordion sections={sections} />
      {/* Acciones usuario */}
      <div className="flex flex-wrap gap-2 justify-end px-6 py-4 border-t border-cyan-100 mt-2 bg-white/70 backdrop-blur-md">
        <button className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm transition-all"><FaSyncAlt className="w-4 h-4" />Volver a empezar</button>
        <button className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm transition-all"><FaStarSolid className="w-4 h-4" />Editar viaje</button>
        <button className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-lg text-sm transition-all"><FaCameraRetro className="w-4 h-4" />Guardar PDF</button>
        <button className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-lg text-sm transition-all"><FaMapMarkedAlt className="w-4 h-4" />Ver ruta en mapa</button>
      </div>
    </motion.div>
  );
}

function daysBetween(start: string, end: string) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
} 