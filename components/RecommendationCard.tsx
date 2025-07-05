import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { Recommendation, AppChatSession, WeatherData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { SailboatIcon } from './icons/SailboatIcon';
import { Button } from './Button';
import ChatInterface from './ChatInterface';
import { AccordionItem } from './AccordionItem';
import { getAccuWeatherIconUrl } from '../services/accuweatherService';
import { SAMBOAT_AFFILIATE_URL } from '../constants'; 

import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { MapRouteIcon } from './icons/MapRouteIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { InfoOutlineIcon } from './icons/InfoOutlineIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ThermometerIcon } from './icons/ThermometerIcon';
import { WindIcon } from './icons/WindIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';


interface RecommendationCardProps {
  recommendation: Recommendation | null;
  isLoading: boolean; // For Gemini text generation
  error: string | null;
  chatSession: AppChatSession | null;
  onSendChatMessage: (message: string) => void;
  onPrintPlan: () => void;
}

interface SectionData {
  id: string;
  title: string;
  content: string;
}

interface ParsedRecommendation {
  mainTitle?: string;
  sections: SectionData[];
}

const WEATHER_DATA_BLOCK_REGEX = /---\s*[\r\n]+\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*(?:.|\r\n|\r\n)*?---/ms;
const APP_URL = "https://www.boattrip-planner.com/";

const parseMarkdownToSections = (markdownTextWithWeatherBlock: string): ParsedRecommendation => {
  let mainTitle: string | undefined;
  const sections: SectionData[] = [];

  const fullText = markdownTextWithWeatherBlock.replace(WEATHER_DATA_BLOCK_REGEX, '').trim();
  
  let textToParseForSections = fullText; 

  const h2MatchResult = fullText.match(/^##\s+(.*)/m);
  const h2Index = h2MatchResult ? fullText.indexOf(h2MatchResult[0]) : -1;

  if (h2MatchResult && h2Index !== -1) {
    mainTitle = h2MatchResult[1].trim();
    textToParseForSections = fullText.substring(h2Index + h2MatchResult[0].length).trim();
  }

  const sectionParts = textToParseForSections.split(/\n(?=###\s+)/m);

  sectionParts.forEach((part, index) => {
    if (part.trim() === "") return;
    const headingMatch = part.match(/^###\s+(.*)/m);
    if (headingMatch) {
      const title = headingMatch[1].trim();
      const content = part.substring(headingMatch[0].length).trim();
      sections.push({
        id: `section-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`,
        title,
        content
      });
    }
  });

  return { mainTitle, sections };
};


const WeatherInfoDisplay: React.FC<{
    weatherData: WeatherData | null | undefined,
    weatherError: string | null | undefined,
    isFetchingWeather: boolean | undefined,
    isAwaitingLocationData: boolean | undefined
}> = ({ weatherData, weatherError, isFetchingWeather, isAwaitingLocationData }) => {

  if (isAwaitingLocationData) {
    return (
      <div className="flex items-center text-sm text-slate-600 my-2">
        <SailboatIcon className="w-4 h-4 mr-2 text-teal-500 animate-pulse" />
        <span>🌦️ Tiempo: Esperando información de ubicación para el pronóstico...</span>
      </div>
    );
  }

  if (isFetchingWeather) {
    return (
      <div className="flex items-center text-sm text-slate-600 my-2">
        <LoadingSpinner size='sm' /> <span className="ml-2">Obteniendo pronóstico del tiempo...</span>
      </div>
    );
  }

  if (weatherError) {
    return <p className="text-sm text-red-600 my-2">🌦️ Tiempo: {weatherError}</p>;
  }

  if (!weatherData) {
    return <p className="text-sm text-slate-600 my-2">🌦️ Tiempo: Información meteorológica no disponible o ubicación no determinada.</p>;
  }

  let iconUrl: string = "";
  const sourceText = "AccuWeather"; // Assuming AccuWeather if data is present
  const forecastDate = new Date(weatherData.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

  if (weatherData.accuWeatherDayIcon) {
    iconUrl = getAccuWeatherIconUrl(weatherData.accuWeatherDayIcon);
  }

  return (
    <div className="mt-1 mb-4 p-3 bg-teal-50 rounded-md border border-teal-200">
      <h5 className="text-md font-semibold text-teal-800 mb-2 flex items-center">
        {iconUrl && <Image src={iconUrl} alt={weatherData.dayIconPhrase} width={32} height={32} className="mr-2 inline-block" />}
        Pronóstico para {forecastDate} (Fuente: {sourceText})
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
        <div className="flex items-center">
          <ThermometerIcon className="w-4 h-4 mr-1 text-teal-600" />
          <span><strong>Condiciones:</strong> {weatherData.dayIconPhrase}</span>
        </div>
        <div className="flex items-center">
           <ThermometerIcon className="w-4 h-4 mr-1 text-teal-600" />
           <span><strong>Temp.:</strong> {weatherData.temperatureMin}°{weatherData.temperatureUnit} / {weatherData.temperatureMax}°{weatherData.temperatureUnit}</span>
        </div>
        <div className="flex items-center">
          <WindIcon className="w-4 h-4 mr-1 text-teal-600" />
          <span><strong>Viento (día):</strong> {weatherData.dayWindSpeed} {weatherData.dayWindUnit} {weatherData.dayWindDirection || ''}</span>
        </div>
        {weatherData.nightWindSpeed !== undefined && (
         <div className="flex items-center">
          <WindIcon className="w-4 h-4 mr-1 text-teal-600" />
          <span><strong>Viento (noche):</strong> {weatherData.nightWindSpeed} {weatherData.nightWindUnit} {weatherData.nightWindDirection || ''}</span>
        </div>
        )}
      </div>
      {weatherData.link && (
        <a href={weatherData.link} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline mt-1 block">
          Ver pronóstico detallado en AccuWeather.com
        </a>
      )}
    </div>
  );
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    isLoading,
    error,
    chatSession,
    onSendChatMessage,
    onPrintPlan
}) => {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const { mainTitle } = useMemo(() => {
    if (!recommendation || !recommendation.text.trim()) {
        return { mainTitle: undefined };
    }
    return parseMarkdownToSections(recommendation.text);
  }, [recommendation]);

  useEffect(() => {
    // When a new accordion is opened, scroll it into view.
    if (openAccordionId) {
        // The timeout gives the accordion's open animation time to start,
        // resulting in a smoother scroll experience.
        const timer = setTimeout(() => {
            const element = document.getElementById(openAccordionId);
            // The 'start' block alignment is better than 'center' because the header is sticky/large.
            // It ensures the accordion title is visible at the top.
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350); // Animation duration is 300ms, so 350ms is a safe delay.

        return () => clearTimeout(timer);
    }
  }, [openAccordionId]);


  const handleToggleAccordion = (sectionId: string) => {
      setOpenAccordionId(prevId => (prevId === sectionId ? null : sectionId));
  };

  const handleModifyPreferences = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareViaWhatsApp = () => {
    if (!recommendation || !recommendation.text) return;

    const { mainTitle } = parseMarkdownToSections(recommendation.text);

    let shareText = "¡Echa un vistazo a este plan de viaje en barco que creé con BoatTrip Planner! 🚤\n\n";

    if (mainTitle) {
      // Remove markdown from title for clean sharing
      const cleanTitle = mainTitle.replace(/##\s*/, '').replace(/[\*_~`]/g, '');
      shareText += `Título del Plan: ${cleanTitle}\n\n`;
    } else {
         shareText = "¡Echa un vistazo a los planes de viaje en barco que puedes crear con BoatTrip Planner! 🚤\n\nDescubre cómo planificar tu aventura náutica ideal.\n\n";
    }
    
    shareText += `Puedes ver más y planificar tu propio viaje en: ${APP_URL}\n\n`;
    shareText += "(Para ver el plan completo que generé, ¡pídeme que te lo copie y pegue aquí!)";

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };


  const baseMarkdownComponents: Components = {
    h4: (props) => <h4 className="text-xl font-semibold text-slate-700 mt-6 mb-4 pb-3 border-b-2 border-slate-200" {...props} />,
    h5: (props) => <h5 className="text-md font-semibold text-slate-700 mt-3 mb-1" {...props} />,
    p: (props) => <p className="text-slate-800 mb-3 leading-relaxed" {...props} />,
    ul: (props) => <ul className="list-disc list-inside pl-5 mb-4 space-y-2 text-slate-800" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside pl-5 mb-4 space-y-2 text-slate-800" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
    a: ({ children, ...props }) => {
        return <a className="text-teal-600 hover:text-teal-700 underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    blockquote: (props) => <blockquote className="bg-white border-l-4 border-teal-300 rounded-r-lg p-4 my-4 shadow-sm text-slate-800 leading-relaxed" {...props} />,
  };

  // NUEVO: Manejo de secciones automáticas desde la API
  interface ApiSections {
    weather?: WeatherData;
    images?: string[];
    map?: string;
    content?: string;
  }
  const apiSections: ApiSections = (recommendation as unknown as { sections?: ApiSections })?.sections || {};

  const aiContent = apiSections.content || recommendation?.text || '';
  const weatherData = apiSections.weather || recommendation?.weatherData;
  const galleryImages = apiSections.images || [];
  const mapUrl = apiSections.map || '';

  // DEBUG: Log para ver qué datos llegan
  console.log('🔍 DEBUG - RecommendationCard data:', {
    hasApiSections: !!apiSections,
    aiContentLength: aiContent?.length || 0,
    weatherData: !!weatherData,
    galleryImagesCount: galleryImages?.length || 0,
    mapUrl: !!mapUrl,
    recommendationText: recommendation?.text?.length || 0
  });

  // Función para parsear el contenido AI en secciones
  const parseAIContent = (content: string) => {
    const sections: { id: string; title: string; content: string; icon: React.ReactNode }[] = [];
    
    if (!content) {
      console.log('⚠️ No hay contenido AI para parsear');
      return sections;
    }

    console.log('📝 Parseando contenido AI:', content.substring(0, 200) + '...');

    const sectionRegex = /##\s*([^\n]+)\n([\s\S]*?)(?=##|$)/g;
    let match;
    let index = 0;

    while ((match = sectionRegex.exec(content)) !== null) {
      const title = match[1].trim();
      const sectionContent = match[2].trim();
      
      console.log(`📋 Sección encontrada: "${title}" con ${sectionContent.length} caracteres`);
      
      if (sectionContent) {
        const icon = getSectionIcon(title);
        sections.push({
          id: `ai-section-${index}`,
          title,
          content: sectionContent,
          icon
        });
        index++;
      }
    }

    console.log(`✅ Secciones parseadas: ${sections.length}`);
    return sections;
  };

  const aiSections = parseAIContent(aiContent);

  const getSectionIcon = (title: string): React.ReactNode => {
    const iconContainerClasses = "flex h-10 w-10 items-center justify-center rounded-full bg-teal-100";
    const iconClasses = "w-6 h-6 text-teal-700";

    if (title.toLowerCase().includes("datos clave") || title.toLowerCase().includes("navegación")) {
      return <div className={iconContainerClasses}><MapRouteIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("resumen")) {
      return <div className={iconContainerClasses}><ClipboardListIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("itinerario")) {
      return <div className={iconContainerClasses}><MapRouteIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("checklist")) {
      return <div className={iconContainerClasses}><ChecklistIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("consejos") || title.toLowerCase().includes("advertencias")) {
      return <div className={iconContainerClasses}><InfoOutlineIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("actividades") || title.toLowerCase().includes("lugares")) {
      return <div className={iconContainerClasses}><StarOutlineIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    if (title.toLowerCase().includes("contacto") || title.toLowerCase().includes("información")) {
      return <div className={iconContainerClasses}><PhoneIcon className={iconClasses} aria-hidden="true" /></div>;
    }
    
    return <div className={iconContainerClasses}><DocumentTextIcon className={iconClasses} aria-hidden="true" /></div>;
  };

  const remarkPlugins = [remarkGfm];

  if (isLoading) {
    return (
      <div className="card bg-white shadow-lg border border-slate-200 rounded-2xl max-w-2xl mx-auto p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner size="md" />
        <p className="mt-6 text-lg text-primary font-semibold">Generando tu recomendación náutica...</p>
      </div>
    );
  }

  if (error) {
    const isApiKeyError = error && (
        error.includes("API_KEY no está configurada") ||
        error.includes("Error de autenticación con la API de Gemini") ||
        error.toLowerCase().includes("api key not valid") ||
        error.toLowerCase().includes("api_key_invalid") ||
        error.toLowerCase().includes("api key is missing")
    );

    return (
      <div className="card bg-white shadow-lg border border-red-200 rounded-2xl max-w-2xl mx-auto p-8 md:p-12 min-h-[300px] w-full">
         <ErrorMessage message={error} />
         {!isApiKeyError && (
           <div className="mt-6 flex justify-center">
              <Button
                  onClick={handleModifyPreferences}
                  variant="primary" 
                  aria-label="Modificar preferencias e intentar de nuevo"
                  className="w-full sm:w-auto px-4"
              >
                Modificar Preferencias e Intentar de Nuevo
              </Button>
            </div>
         )}
      </div>
    );
  }

  if (!recommendation || !recommendation.text?.trim()) {
    return (
      <div className="card bg-white shadow-lg border border-slate-200 rounded-2xl max-w-2xl mx-auto p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] text-center w-full">
        <SailboatIcon className="w-16 h-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-primary mb-2">¿Listo para la Aventura?</h3>
        <p className="text-slate-600">¡Completa el formulario para obtener recomendaciones personalizadas de viajes en barco!</p>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-lg border border-slate-200 rounded-2xl max-w-2xl mx-auto p-8 md:p-12">
      <div className="flex items-center gap-4 mb-6">
        <SailboatIcon className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-bold text-primary">{mainTitle || 'Recomendación'}</h2>
      </div>

      {/* Sección Clima */}
      {weatherData && (
        <AccordionItem
          id="weather-section"
          title="🌦️ Pronóstico del Clima"
          icon={<ThermometerIcon className="w-6 h-6 text-teal-700" />}
          isOpen={openAccordionId === 'weather-section'}
          onToggle={() => handleToggleAccordion('weather-section')}
        >
          <WeatherInfoDisplay
            weatherData={weatherData}
            weatherError={recommendation?.weatherError}
            isFetchingWeather={recommendation?.isFetchingWeather}
            isAwaitingLocationData={recommendation?.isAwaitingLocationData}
          />
        </AccordionItem>
      )}

      {/* Sección Galería de Imágenes */}
      {galleryImages && galleryImages.length > 0 && (
        <AccordionItem
          id="gallery-section"
          title="🖼️ Galería de Imágenes"
          icon={<DocumentTextIcon className="w-6 h-6 text-teal-700" />}
          isOpen={openAccordionId === 'gallery-section'}
          onToggle={() => handleToggleAccordion('gallery-section')}
        >
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((img: string, idx: number) => (
              <div key={img + idx} className="rounded overflow-hidden border border-slate-200">
                <Image src={img} alt={`Foto destino ${idx + 1}`} width={300} height={200} className="object-cover w-full h-32" />
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Sección Mapa */}
      {mapUrl && (
        <AccordionItem
          id="map-section"
          title="🗺️ Mapa de Ruta"
          icon={<MapRouteIcon className="w-6 h-6 text-teal-700" />}
          isOpen={openAccordionId === 'map-section'}
          onToggle={() => handleToggleAccordion('map-section')}
        >
          <div className="w-full flex justify-center">
            <Image src={mapUrl} alt="Mapa de ruta" width={600} height={300} className="rounded border border-slate-200" />
          </div>
        </AccordionItem>
      )}

      {/* Sección Contenido IA (Markdown estructurado) */}
      {aiSections.map((section) => (
        <AccordionItem
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          isOpen={openAccordionId === section.id}
          onToggle={() => handleToggleAccordion(section.id)}
        >
          <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
            {section.content}
          </ReactMarkdown>
        </AccordionItem>
      ))}

      {/* Fallback: Si no hay secciones AI, mostrar contenido básico */}
      {aiSections.length === 0 && aiContent && (
        <AccordionItem
          id="basic-content-section"
          title="📝 Recomendación Generada"
          icon={<DocumentTextIcon className="w-6 h-6 text-teal-700" />}
          isOpen={openAccordionId === 'basic-content-section'}
          onToggle={() => handleToggleAccordion('basic-content-section')}
        >
          <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
            {aiContent}
          </ReactMarkdown>
        </AccordionItem>
      )}

      {/* Fallback: Si no hay contenido AI, mostrar mensaje informativo */}
      {aiSections.length === 0 && !aiContent && (
        <AccordionItem
          id="info-section"
          title="ℹ️ Información del Viaje"
          icon={<InfoOutlineIcon className="w-6 h-6 text-teal-700" />}
          isOpen={openAccordionId === 'info-section'}
          onToggle={() => handleToggleAccordion('info-section')}
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🚤 Plan de Viaje a tu destino</h4>
              <p className="text-blue-700">
                Hemos generado una recomendación personalizada para tu viaje en barco. 
                Las secciones detalladas se están cargando automáticamente con información 
                del clima, imágenes del destino y contenido generado por IA.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">💡 Consejos Generales</h4>
              <ul className="text-amber-700 space-y-2">
                <li>• Verifica el pronóstico del tiempo antes de zarpar</li>
                <li>• Lleva documentación del barco y licencias necesarias</li>
                <li>• Equípate con chalecos salvavidas y equipo de seguridad</li>
                <li>• Planifica rutas alternativas por si cambia el clima</li>
                <li>• Ten números de emergencia a mano</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Próximos Pasos</h4>
              <p className="text-green-700">
                Para obtener recomendaciones más detalladas, asegúrate de que todas las 
                APIs estén configuradas correctamente. Puedes modificar tus preferencias 
                y generar una nueva recomendación.
              </p>
            </div>
          </div>
        </AccordionItem>
      )}

      <div className="mt-8 pt-6 border-t-2 border-slate-300/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <Button
          onClick={handleModifyPreferences}
          variant="secondary"
          className="w-full"
          aria-label="Modificar mis preferencias y volver al formulario"
        >
          🔄 Modificar Preferencias
        </Button>
         <Button
          onClick={onPrintPlan}
          variant="secondary"
          className="w-full"
          aria-label="Imprimir este plan"
        >
          🖨️ Imprimir Plan
        </Button>
        <Button
          onClick={handleShareViaWhatsApp}
          variant="secondary" 
          className="w-full bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 flex items-center justify-center transform transition-all hover:-translate-y-0.5"
          aria-label="Compartir plan por WhatsApp"
        >
          <WhatsAppIcon className="w-5 h-5 mr-2" /> Compartir
        </Button>
        <Button
          onClick={() => window.open(SAMBOAT_AFFILIATE_URL, '_blank', 'noopener,noreferrer')}
          variant="primary"
          className="w-full text-center flex items-center justify-center"
          aria-label="Ver barcos en SamBoat (enlace externo)"
        >
          <SailboatIcon className="w-5 h-5 mr-2" /> Ver Barcos
        </Button>
      </div>

      {chatSession && (
        <div className="mt-8 pt-6 border-t border-slate-200 no-print">
            <ChatInterface
                chatSession={chatSession}
                onSendMessage={onSendChatMessage}
            />
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;