import React, { useState, useEffect, useId, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Recommendation, AppChatSession, CustomChecklistItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import ChatInterface from './ChatInterface';
import { AccordionItem } from './AccordionItem';
import { SAMBOAT_AFFILIATE_URL } from '../constants'; 
import { InputField } from './FormControls';
import { Element as HastElement } from 'hast';

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
  introduction?: string;
  sections: SectionData[];
}

const WEATHER_DATA_BLOCK_REGEX = /---\s*[\r\n]+\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*(?:.|\r\n|\r\n)*?---/ms;
const APP_URL = "https://www.boattrip-planner.com/";

const purchasableKeywords: string[] = [
  "crema solar", "protector solar", "gafas de sol", "sombrero", "gorra", "toalla", 
  "ropa de baño", "traje de baño", "bañador", "bikini", "ropa de abrigo", "chaqueta", 
  "cortavientos", "calzado de barco", "escarpines", "chanclas", "agua embotellada", 
  "snacks", "comida para llevar", "bolsas de basura", "botiquín", "pastillas para el mareo", 
  "cargador de móvil", "batería externa", "power bank", "equipo de snorkel", "máscara de buceo", 
  "aletas", "tubo de snorkel", "licencia de pesca", "caña de pescar", "anzuelos", "cebo", 
  "nevera portátil", "cooler", "altavoz bluetooth", "altavoz impermeable", "libro", "revista", 
  "mapa náutico", "carta náutica", "chaleco salvavidas", "bengalas de emergencia", "radio vhf portátil", 
  "ancla de capa", "cuerda náutica", "cabo", "defensas para barco", "linterna impermeable", 
  "cuchillo multiusos", "navaja suiza", "pastillas potabilizadoras de agua", "repelente de insectos", 
  "productos biodegradables", "bolsa estanca", "funda impermeable", "cámara acuática", "go pro",
  "aletas de paddle surf", "remo", "hinchador", "kayak inflable", "donut acuático", "wakeboard",
  "antiempañante para gafas", "crema aftersun"
];

const isItemPotentiallyPurchasable = (itemText: string): boolean => {
  if (!itemText) return false;
  const lowerItemText = itemText.toLowerCase();
  return purchasableKeywords.some(keyword => lowerItemText.includes(keyword));
};

const parseMarkdownToSections = (markdownTextWithWeatherBlock: string): ParsedRecommendation => {
  let mainTitle: string | undefined;
  let introduction = "";
  const sections: SectionData[] = [];

  const fullText = markdownTextWithWeatherBlock.replace(WEATHER_DATA_BLOCK_REGEX, '').trim();
  
  let textBeforeH2 = "";
  let textToParseForSections = fullText; 

  const h2MatchResult = fullText.match(/^##\s+(.*)/m);
  const h2Index = h2MatchResult ? fullText.indexOf(h2MatchResult[0]) : -1;

  if (h2MatchResult && h2Index !== -1) {
    mainTitle = h2MatchResult[1].trim();
    if (h2Index > 0) {
      textBeforeH2 = fullText.substring(0, h2Index).trim();
    }
    textToParseForSections = fullText.substring(h2Index + h2MatchResult[0].length).trim();
  }

  const sectionParts = textToParseForSections.split(/\n(?=###\s+)/m);
  let introFromMainContent = "";

  if (sectionParts.length > 0 && !sectionParts[0].startsWith("###")) {
    introFromMainContent = sectionParts.shift()?.trim() || "";
  }

  if (textBeforeH2 && introFromMainContent) {
    introduction = `${textBeforeH2}\n\n${introFromMainContent}`;
  } else if (textBeforeH2) {
    introduction = textBeforeH2;
  } else {
    introduction = introFromMainContent;
  }
  introduction = introduction.trim();
  if (introduction.match(/^(\n\s*)+$/)) { 
    introduction = "";
  }

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
    } else if (part.trim() && !mainTitle && !introduction && sections.length === 0) {
      introduction = part.trim();
    }
  });

  return { mainTitle, introduction, sections };
};

const WeatherInfoDisplay: React.FC<{
    weatherData: any | null | undefined,
    weatherError: string | null | undefined,
    isFetchingWeather: boolean | undefined,
    isAwaitingLocationData: boolean | undefined
}> = ({ weatherData, weatherError, isFetchingWeather, isAwaitingLocationData }) => {

  if (isAwaitingLocationData) {
    return (
      <div className="flex items-center text-sm text-slate-600 my-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
        <span className="text-lg mr-2">🌦️</span>
        <span>Tiempo: Esperando información de ubicación para el pronóstico...</span>
      </div>
    );
  }

  if (isFetchingWeather) {
    return (
      <div className="flex items-center text-sm text-slate-600 my-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
        <LoadingSpinner size='sm' /> 
        <span className="ml-2">Obteniendo pronóstico del tiempo...</span>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="text-sm text-red-600 my-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50">
        🌦️ Tiempo: {weatherError}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-sm text-slate-600 my-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50">
        🌦️ Tiempo: Información meteorológica no disponible o ubicación no determinada.
      </div>
    );
  }

  let iconUrl: string = "";
  const sourceText = "AccuWeather"; // Assuming AccuWeather if data is present
  let forecastDate = new Date(weatherData.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

  if (weatherData.accuWeatherDayIcon) {
    iconUrl = `https://developer.accuweather.com/sites/default/files/${weatherData.accuWeatherDayIcon}-s.png`;
  }

  return (
    <div className="mt-2 mb-6 p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border border-blue-200/50 shadow-sm">
      <h5 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 flex items-center">
        {iconUrl && <img src={iconUrl} alt={weatherData.dayIconPhrase} className="w-10 h-10 mr-3 inline-block" />}
        Pronóstico para {forecastDate} (Fuente: {sourceText})
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
        <div className="flex items-center p-3 bg-white/50 rounded-xl border border-white/50">
          <span className="text-lg mr-2">🌡️</span>
          <span><strong>Condiciones:</strong> {weatherData.dayIconPhrase}</span>
        </div>
        <div className="flex items-center p-3 bg-white/50 rounded-xl border border-white/50">
           <span className="text-lg mr-2">🌡️</span>
           <span><strong>Temp.:</strong> {weatherData.temperatureMin}°{weatherData.temperatureUnit} / {weatherData.temperatureMax}°{weatherData.temperatureUnit}</span>
        </div>
        <div className="flex items-center p-3 bg-white/50 rounded-xl border border-white/50">
          <span className="text-lg mr-2">💨</span>
          <span><strong>Viento (día):</strong> {weatherData.dayWindSpeed} {weatherData.dayWindUnit} {weatherData.dayWindDirection || ''}</span>
        </div>
        {weatherData.nightWindSpeed !== undefined && (
         <div className="flex items-center p-3 bg-white/50 rounded-xl border border-white/50">
          <span className="text-lg mr-2">💨</span>
          <span><strong>Viento (noche):</strong> {weatherData.nightWindSpeed} {weatherData.nightWindUnit} {weatherData.nightWindDirection || ''}</span>
        </div>
        )}
      </div>
    </div>
  );
};

const getNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return getNodeText((node as any).props.children);
  }
  return '';
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
  const [checkedAiItems, setCheckedAiItems] = useState<Record<string, boolean>>({});
  const [customChecklistItems, setCustomChecklistItems] = useState<CustomChecklistItem[]>([]);
  const [newCustomItemText, setNewCustomItemText] = useState('');
  const componentId = useId();
  const userAffiliateLink = "https://www.amazon.es/s?k=";

  const { mainTitle, introduction, sections } = useMemo(() => {
    if (!recommendation?.text) return { mainTitle: undefined, introduction: undefined, sections: [] };
    return parseMarkdownToSections(recommendation.text);
  }, [recommendation?.text]);

  const handleToggleAccordion = (sectionId: string) => {
    setOpenAccordionId(openAccordionId === sectionId ? null : sectionId);
  };

  const handleToggleAiItem = (itemKey: string) => {
    setCheckedAiItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const handleAddCustomItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newCustomItemText.trim()) {
      const newItem: CustomChecklistItem = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newCustomItemText.trim(),
        checked: false
      };
      setCustomChecklistItems(prev => [...prev, newItem]);
      setNewCustomItemText('');
    }
  };

  const handleToggleCustomItem = (itemId: string) => {
    setCustomChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleModifyPreferences = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareViaWhatsApp = () => {
    if (!recommendation || !recommendation.text) return;

    const { mainTitle, introduction } = parseMarkdownToSections(recommendation.text);

    let shareText = "¡Echa un vistazo a este plan de viaje en barco que creé con BoatTrip Planner! 🚤\n\n";

    if (mainTitle) {
      // Remove markdown from title for clean sharing
      const cleanTitle = mainTitle.replace(/##\s*/, '').replace(/[\*_~`]/g, '');
      shareText += `Título del Plan: ${cleanTitle}\n\n`;
    }

    if (introduction) {
      // Remove markdown from intro for clean sharing, and truncate
      const cleanIntroduction = introduction.replace(/[\*_~`#>]/g, '');
      const snippet = cleanIntroduction.substring(0, 150);
      shareText += `Un pequeño adelanto: ${snippet}${cleanIntroduction.length > 150 ? "..." : ""}\n\n`;
    } else if (!mainTitle) {
         shareText = "¡Echa un vistazo a los planes de viaje en barco que puedes crear con BoatTrip Planner! 🚤\n\nDescubre cómo planificar tu aventura náutica ideal.\n\n";
    }
    
    shareText += `Puedes ver más y planificar tu propio viaje en: ${APP_URL}\n\n`;
    shareText += "(Para ver el plan completo que generé, ¡pídeme que te lo copie y pegue aquí!)";

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const baseMarkdownComponents: Components = {
    h4: ({node, ...props}) => <h4 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mt-8 mb-4 pb-3 border-b-2 border-slate-200" {...props} />,
    h5: ({node, ...props}) => <h5 className="text-lg font-bold text-slate-700 mt-4 mb-2" {...props} />,
    p: ({node, ...props}) => <p className="text-slate-800 mb-4 leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-inside pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
    li: ({node, ...props}) => <li className="mb-2" {...props} />,
    strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
    a: ({ node, children, ...props }) => {
        return <a className="text-blue-600 hover:text-blue-700 underline font-medium" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    blockquote: ({node, ...props}) => <blockquote className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-r-xl p-6 my-6 shadow-sm text-slate-800 leading-relaxed" {...props} />,
  };

  const interactiveChecklistComponents: Components = {
    ...baseMarkdownComponents,
    h5: ({node, ...props}) => <h5 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent bg-blue-50 px-4 py-3 rounded-xl mt-6 mb-4 shadow-sm border border-blue-200/50" {...props} />,
    ul: ({node, ...props}) => <ul className="list-none p-0 m-0 space-y-0 mb-6" {...props} />, 
    li: ({ node, children, ...props }) => {
      const itemKey = (node as any).position?.start?.offset?.toString() || `ai-item-${(node as HastElement & {index?: number})?.index ?? Math.random().toString(36).substr(2, 9)}`;
      const isChecked = !!checkedAiItems[itemKey];
      const textContent = getNodeText(children).trim();
      const isPurchasable = isItemPotentiallyPurchasable(textContent);

      if (!textContent) {
        return <li className="mb-2" {...props}>{children}</li>;
      }
      
      const amazonLink = userAffiliateLink;

      return (
        <li
            className={`flex items-start py-4 border-b border-slate-200/50 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-200 rounded-xl -mx-2 px-2 ${isChecked ? 'opacity-60' : ''}`}
        >
          <input
            type="checkbox"
            id={`${componentId}-${itemKey}`}
            checked={isChecked}
            onChange={() => handleToggleAiItem(itemKey)}
            className="h-6 w-6 text-blue-600 border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 mr-4 mt-0.5 flex-shrink-0 cursor-pointer"
            aria-labelledby={`${componentId}-${itemKey}-label`}
          />
          <label
            id={`${componentId}-${itemKey}-label`}
            htmlFor={`${componentId}-${itemKey}`}
            className={`flex-grow cursor-pointer leading-relaxed ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}
             onClick={(e) => {
              if ((e.target as HTMLElement).closest('a[data-amazon-link="true"]')) {
                return; 
              }
              handleToggleAiItem(itemKey);
            }}
          >
            {children}
          </label>
          {isPurchasable && (
            <a
              href={amazonLink} 
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={`Ver "${textContent}" en Amazon.es (afiliado)`} 
              className="ml-3 p-2 text-amber-600 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg flex-shrink-0 hover:bg-amber-50 transition-all duration-200"
              onClick={(e) => e.stopPropagation()} 
              data-amazon-link="true" 
              aria-label={`Ver "${textContent}" en Amazon.es (enlace de afiliado)`}
            >
              <span className="text-lg">🛒</span>
            </a>
          )}
        </li>
      );
    },
     a: ({ node, children, href, ...props }) => {
        return (
          <a href={href} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-blue-600 hover:text-blue-700 underline font-medium"
             onClick={(e) => e.stopPropagation()} 
          >
            {children}
          </a>
        );
    },
  };

  if (isLoading) {
    return null;
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
      <div className="bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 p-8 rounded-3xl shadow-2xl min-h-[300px] w-full border border-red-100/50">
         <ErrorMessage message={error} />
         {!isApiKeyError && (
           <div className="mt-8 flex justify-center">
              <Button
                  onClick={handleModifyPreferences}
                  variant="primary" 
                  aria-label="Modificar preferencias e intentar de nuevo"
                  className="w-full sm:w-auto px-6 py-3"
              >
                Modificar Preferencias e Intentar de Nuevo
              </Button>
            </div>
         )}
      </div>
    );
  }

  if (!recommendation || !recommendation.text.trim()) {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[300px] text-center w-full border border-blue-100/50">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          ¿Listo para la Aventura?
        </h3>
        <p className="text-lg text-slate-600 font-medium">¡Completa el formulario para obtener recomendaciones personalizadas de viajes en barco!</p>
      </div>
    );
  }

  const remarkPlugins = [remarkGfm];

  return (
    <div id="recommendation-content" className="recommendation-card bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 p-10 md:p-12 rounded-3xl shadow-2xl w-full break-words border border-blue-100/50 backdrop-blur-sm">
      {mainTitle && (
        <div className="mb-10 pb-6 border-b border-slate-200/50">
          <h2 className="recommendation-header text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-center drop-shadow-lg">
            <ReactMarkdown remarkPlugins={remarkPlugins} components={{p: ({node, ...props}) => <span {...props} />}}>
              {mainTitle}
            </ReactMarkdown>
          </h2>
        </div>
      )}
      {introduction && (
        <div className="recommendation-intro text-slate-700 mb-10 leading-relaxed bg-gradient-to-br from-white/80 via-slate-50/80 to-blue-50/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200/50">
          <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
            {introduction}
          </ReactMarkdown>
        </div>
      )}

      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section) => {
            const isChecklistSection = section.title.toLowerCase().includes("checklist") || section.title.includes("✅");
            const isNavDataSection = section.title.toLowerCase().includes("datos clave") || section.title.includes("🗺️");
            
            // Regex to remove leading emojis for a cleaner title display. The 'u' flag is for unicode.
            const cleanTitle = section.title.replace(/^(\s*[\p{Emoji_Presentation}\p{Emoji}]\s*)+/u, '').trim();
            
            return (
              <AccordionItem
                key={section.id}
                id={section.id}
                title={cleanTitle}
                icon={null}
                isOpen={openAccordionId === section.id}
                onToggle={() => handleToggleAccordion(section.id)}
              >
                {isNavDataSection && (
                  <WeatherInfoDisplay
                    weatherData={recommendation?.weatherData}
                    weatherError={recommendation?.weatherError}
                    isFetchingWeather={recommendation?.isFetchingWeather}
                    isAwaitingLocationData={recommendation?.isAwaitingLocationData}
                  />
                )}
                <ReactMarkdown
                  remarkPlugins={remarkPlugins}
                  components={isChecklistSection ? interactiveChecklistComponents : baseMarkdownComponents}
                >
                  {section.content}
                </ReactMarkdown>
                {isChecklistSection && (
                  <div className="mt-8 pt-6 border-t border-slate-300/50">
                    <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                      Añadir artículos propios a la checklist:
                    </h4>
                    {customChecklistItems.length > 0 && (
                        <ul className="list-none p-0 m-0 space-y-0 mb-6">
                        {customChecklistItems.map(item => (
                          <li key={item.id} className={`flex items-start py-4 border-b border-slate-200/50 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-200 rounded-xl -mx-2 px-2 ${item.checked ? 'opacity-60' : ''}`}>
                            <input
                              type="checkbox"
                              id={item.id}
                              checked={item.checked}
                              onChange={() => handleToggleCustomItem(item.id)}
                              className="h-6 w-6 text-blue-600 border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 mr-4 mt-0.5 flex-shrink-0 cursor-pointer"
                              aria-labelledby={`${item.id}-label`}
                            />
                            <label
                                id={`${item.id}-label`}
                                htmlFor={item.id}
                                className={`flex-grow cursor-pointer leading-relaxed ${item.checked ? 'line-through text-slate-500' : 'text-slate-800'}`}
                            >
                              {item.text}
                            </label>
                          </li>
                        ))}
                        </ul>
                    )}
                    <form onSubmit={handleAddCustomItem} className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <InputField
                        label=""
                        aria-label="Nuevo artículo para la checklist"
                        id={`${componentId}-new-custom-item`}
                        type="text"
                        value={newCustomItemText}
                        onChange={(e) => setNewCustomItemText(e.target.value)}
                        placeholder="Escribe tu artículo aquí..."
                        className="flex-grow !mt-0 bg-white text-slate-800 placeholder:text-slate-500"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="px-6 py-3 w-full sm:w-auto" 
                        disabled={!newCustomItemText.trim()}
                      >
                        Añadir
                      </Button>
                    </form>
                  </div>
                )}
              </AccordionItem>
            );
          })}
        </div>
      ) : (
         !mainTitle && !introduction && recommendation.text && (
            <div className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/50 p-6 rounded-2xl shadow-lg text-slate-700 border border-slate-200/50">
                 <ReactMarkdown remarkPlugins={remarkPlugins} components={baseMarkdownComponents}>
                    {recommendation.text}
                 </ReactMarkdown>
            </div>
         )
      )}

      <div className="mt-10 pt-8 border-t-2 border-slate-300/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <Button
          onClick={handleModifyPreferences}
          variant="secondary"
          className="w-full"
          aria-label="Modificar mis preferencias y volver al formulario"
        >
          Modificar Preferencias
        </Button>
         <Button
          onClick={onPrintPlan}
          variant="secondary"
          className="w-full"
          aria-label="Imprimir este plan"
        >
          Imprimir Plan
        </Button>
        <Button
          onClick={handleShareViaWhatsApp}
          variant="secondary" 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-400 flex items-center justify-center transform transition-all hover:-translate-y-1 shadow-lg"
          aria-label="Compartir plan por WhatsApp"
        >
          <span className="text-lg mr-2">📱</span> Compartir
        </Button>
        <Button
          onClick={() => window.open(SAMBOAT_AFFILIATE_URL, '_blank', 'noopener,noreferrer')}
          variant="primary"
          className="w-full text-center flex items-center justify-center"
          aria-label="Ver barcos en SamBoat (enlace externo)"
        >
          <span className="text-lg mr-2">🚤</span> Ver Barcos
        </Button>
      </div>

      {chatSession && (
        <div className="mt-10 pt-8 border-t border-slate-200/50 no-print">
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