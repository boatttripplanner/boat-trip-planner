

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UserPreferences, Recommendation, AppChatSession, AppView, CookieConsentStatus } from './types';
import { APP_TITLE, AD_CLIENT_ID, AD_SLOT_ID_BANNER_CONTENT, DEFAULT_APP_DESCRIPTION, BASE_URL, BLOG_TITLE, BLOG_INDEX_DESCRIPTION, GEMINI_MODEL_NAME } from './constants';
import { getConfig } from './config.local';
import UserInputForm from './components/UserInputForm';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import CookieConsentBanner from './components/CookieConsentBanner';
import AdSlot from './components/AdSlot'; 
import NotFoundPage from './components/NotFoundPage';
import BlogIndexPage from './src/components/BlogIndexPage';
import BlogPostPage from './src/components/BlogPostPage';
import ScrollToTopButton from './components/ScrollToTopButton';
import AndroidCompatibilityAlert from './components/AndroidCompatibilityAlert';
import LoadingOverlay from './components/LoadingOverlay';
import { generateBoatTripRecommendationStream, constructPrompt } from './services/geminiService';
import { getLocationKey as getAccuWeatherLocationKey, getWeatherForecast as getAccuWeatherForecast } from './services/accuweatherService';
import { ChatMessage } from './types';
import { GoogleGenAI } from "@google/genai";
import { allBlogPosts } from './src/blogData';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { MobileOptimizations } from './components/MobileOptimizations';


interface LocationForWeather {
  cityName: string;
  countryCode: string;
  regionName?: string;
}

const loadingMessages = [
  "Consultando las estrellas para tu ruta... ✨",
  "Ajustanto las velas por ti... ⛵",
  "Navegando por un mar de ideas... 🌊",
  "Buscando tesoros de recomendación... 💎",
  "Zarpando hacia la creatividad... ⚓",
  "Cartografiando tu aventura perfecta... 🗺️",
  "Afinando los instrumentos de navegación... 🧭",
  "Descifrando los vientos del destino... 💨",
  "Pescando los mejores consejos para ti... 🎣",
  "Explorando horizontes digitales... 🌅"
];

const updateGtagConsent = (granted: boolean) => {
  if (import.meta.env.DEV) return; // Solo en producción
  if (typeof (window as any).gtag !== 'function') {
    // gtag might not be loaded yet, e.g., due to an ad blocker.
    // The default is already set to 'denied' in index.html, so this is safe.
    console.warn("gtag function not found. Consent update skipped.");
    return;
  }
  const consentState = granted ? 'granted' : 'denied';
  (window as any).gtag('consent', 'update', {
    'ad_storage': consentState,
    'ad_user_data': consentState,
    'ad_personalization': consentState,
    'analytics_storage': consentState
  });
};

const getViewAndSlugFromLocation = (): { view: AppView; slug: string | null } => {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view') as AppView | null;
  const slugParam = params.get('slug');

  switch (viewParam) {
    case AppView.BLOG_POST:
      if (slugParam) {
        const postExists = allBlogPosts.some(p => p.frontmatter.slug === slugParam);
        return postExists ? { view: AppView.BLOG_POST, slug: slugParam } : { view: AppView.NOT_FOUND, slug: null };
      }
      return { view: AppView.NOT_FOUND, slug: null }; 
    case AppView.BLOG_INDEX:
      return { view: AppView.BLOG_INDEX, slug: null };
    case AppView.MAIN_APP:
      return { view: AppView.MAIN_APP, slug: null };
    case AppView.NOT_FOUND:
        return { view: AppView.NOT_FOUND, slug: null};
    default:
      if (!viewParam) return { view: AppView.MAIN_APP, slug: null };
      return { view: AppView.NOT_FOUND, slug: null };
  }
};


const App: React.FC = () => {
  const config = getConfig();
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recommendationRef = useRef<HTMLDivElement>(null);

  const [activeChatSession, setActiveChatSession] = useState<AppChatSession | null>(null);
  
  const initialNavigationState = getViewAndSlugFromLocation();
  const [currentView, setCurrentView] = useState<AppView>(initialNavigationState.view);
  const [currentBlogPostSlug, setCurrentBlogPostSlug] = useState<string | null>(initialNavigationState.slug);

  const geminiApiKey = config.GEMINI_API_KEY;
  const aiInstance = useRef(new GoogleGenAI({ apiKey: geminiApiKey }));

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentStatus>(CookieConsentStatus.PENDING);
  const [showAds, setShowAds] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);


  const updateURL = useCallback((view: AppView, slug: string | null = null) => {
    let newPath = '/';
    const state = { view, slug };
    const params = new URLSearchParams();

    if (view === AppView.MAIN_APP) {
        // For main app, URL should be just '/'
    } else if (view === AppView.BLOG_INDEX) {
      params.set('view', AppView.BLOG_INDEX);
      newPath = `/?${params.toString()}`;
    } else if (view === AppView.BLOG_POST && slug) {
      params.set('view', AppView.BLOG_POST);
      params.set('slug', slug);
      newPath = `/?${params.toString()}`;
    } else if (view === AppView.NOT_FOUND) {
      params.set('view', AppView.NOT_FOUND);
      newPath = `/?${params.toString()}`;
    }
    
    const currentFullPath = window.location.pathname + window.location.search;
    if (currentFullPath !== newPath) {
      window.history.pushState(state, '', newPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        setCurrentBlogPostSlug(event.state.slug || null);
      } else {
        const { view: urlView, slug: urlSlug } = getViewAndSlugFromLocation();
        setCurrentView(urlView);
        setCurrentBlogPostSlug(urlSlug);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); 


  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent === CookieConsentStatus.ACCEPTED) {
      updateGtagConsent(true);
      setCookieConsent(CookieConsentStatus.ACCEPTED);
      setShowAds(true);
    } else if (storedConsent === CookieConsentStatus.DECLINED) {
      updateGtagConsent(false);
      setCookieConsent(CookieConsentStatus.DECLINED);
      setShowAds(false);
    }
     else {
      // Default consent is already set to denied in index.html, no need to call update
      setCookieConsent(CookieConsentStatus.PENDING);
      setShowAds(false);
    }
  }, []);

  const handleCookieConsent = () => {
    localStorage.setItem('cookieConsent', CookieConsentStatus.ACCEPTED);
    updateGtagConsent(true);
    setCookieConsent(CookieConsentStatus.ACCEPTED);
    setShowAds(true);
  };

  const handleCookieDecline = () => {
    localStorage.setItem('cookieConsent', CookieConsentStatus.DECLINED);
    updateGtagConsent(false);
    setCookieConsent(CookieConsentStatus.DECLINED);
    setShowAds(false);
  };

  const handleReconsiderCookies = () => {
    setCookieConsent(CookieConsentStatus.PENDING); 
  };


  useEffect(() => {
    if (showPrivacyModal || showTermsModal || cookieConsent === CookieConsentStatus.PENDING) {
      return;
    }
    const performScrollToTop = () => window.scrollTo(0, 0);

    if (currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST) {
      const timerId = setTimeout(performScrollToTop, 50); 
      return () => clearTimeout(timerId);
    } else if ( (currentView === AppView.MAIN_APP && !isGenerating && !recommendation?.text) ||
                currentView === AppView.NOT_FOUND ) {
      performScrollToTop();
    }
  }, [currentView, currentBlogPostSlug, isGenerating, recommendation, showPrivacyModal, showTermsModal, cookieConsent]);


  useEffect(() => {
    let newTitle = APP_TITLE;
    let newDescription = DEFAULT_APP_DESCRIPTION;
    let canonicalPath = '/';
    let currentOgImage = `${BASE_URL}/og-image.png`;
    let isNotFoundState = false;
    
    const defaultPublisher = {
        "@type": "Organization",
        "name": APP_TITLE,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/favicon.svg`
        }
    };

    let structuredData: any = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": APP_TITLE,
        "description": DEFAULT_APP_DESCRIPTION,
        "applicationCategory": "TravelApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 support, JavaScript",
        "url": BASE_URL,
        "image": currentOgImage,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
        },
        "keywords": "planificador de barcos, alquiler de barcos, viajes en barco, IA, planificación de viajes, náutica, vacaciones en barco, itinerarios náuticos, blog de nautica, consejos de navegacion, destinos nauticos",
        "publisher": defaultPublisher
    };


    switch (currentView) {
        case AppView.BLOG_INDEX:
            newTitle = `${BLOG_TITLE} | ${APP_TITLE}`;
            newDescription = BLOG_INDEX_DESCRIPTION;
            canonicalPath = '/?view=blog_index';
            structuredData = {
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": BLOG_TITLE,
                "description": BLOG_INDEX_DESCRIPTION,
                "url": `${BASE_URL}${canonicalPath}`,
                "publisher": defaultPublisher,
                "image": currentOgImage,
            };
            break;
        case AppView.BLOG_POST:
            const post = currentBlogPostSlug ? allBlogPosts.find(p => p.frontmatter.slug === currentBlogPostSlug) : null;
            if (post) {
                newTitle = `${post.frontmatter.title} | ${BLOG_TITLE}`;
                newDescription = post.frontmatter.summary;
                canonicalPath = `/?view=blog_post&slug=${currentBlogPostSlug}`;
                currentOgImage = post.frontmatter.featuredImage ? `${BASE_URL}${post.frontmatter.featuredImage}` : currentOgImage;
                
                let authorData: any = defaultPublisher; 
                if (post.frontmatter.author && post.frontmatter.author !== 'El Equipo de BoatTrip Planner') {
                    authorData = {
                        "@type": "Person",
                        "name": post.frontmatter.author
                    };
                }

                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `${BASE_URL}${canonicalPath}`
                    },
                    "headline": post.frontmatter.title,
                    "description": post.frontmatter.summary,
                    "image": {
                        "@type": "ImageObject",
                        "url": currentOgImage,
                    },
                    "author": authorData,
                    "publisher": defaultPublisher,
                    "datePublished": post.frontmatter.date,
                    "dateModified": post.frontmatter.date, 
                    "keywords": post.frontmatter.tags ? post.frontmatter.tags.join(', ') : undefined,
                    "url": `${BASE_URL}${canonicalPath}`
                };
            } else {
                 isNotFoundState = true; 
            }
            break;
        case AppView.NOT_FOUND:
            isNotFoundState = true;
            break;
        default: 
            break;
    }

    if (isNotFoundState) {
        newTitle = `Página No Encontrada | ${APP_TITLE}`;
        newDescription = "La página que buscas no existe en BoatTrip Planner.";
        canonicalPath = `/?view=${AppView.NOT_FOUND}`;
        currentOgImage = `${BASE_URL}/og-image.png`; 
        structuredData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": newTitle,
            "description": newDescription,
            "url": `${BASE_URL}${canonicalPath}`,
            "image": currentOgImage,
            "publisher": defaultPublisher
        };
    }

    document.title = newTitle;

    const updateMetaTag = (selector: string, attribute: string, content: string) => {
        let tag = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
        if (!tag && selector.startsWith('meta')) {
            tag = document.createElement('meta');
            const nameOrProperty = selector.match(/name="([^"]+)"|property="([^"]+)"/);
            if (nameOrProperty?.[1]) tag.setAttribute('name', nameOrProperty[1]);
            if (nameOrProperty?.[2]) (tag as HTMLMetaElement).setAttribute('property', nameOrProperty[2]);
            document.head.appendChild(tag);
        } else if (!tag && selector === 'link[rel="canonical"]') {
            tag = document.createElement('link');
            (tag as HTMLLinkElement).setAttribute('rel', 'canonical');
            document.head.appendChild(tag);
        }
        if (tag) tag.setAttribute(attribute, content);
    };
    
    updateMetaTag('meta[name="description"]', 'content', newDescription);
    updateMetaTag('meta[property="og:title"]', 'content', newTitle);
    updateMetaTag('meta[property="og:description"]', 'content', newDescription);
    updateMetaTag('meta[property="twitter:title"]', 'content', newTitle);
    updateMetaTag('meta[property="twitter:description"]', 'content', newDescription);
    updateMetaTag('meta[property="og:image"]', 'content', currentOgImage);
    updateMetaTag('meta[property="twitter:image"]', 'content', currentOgImage);
    
    const canonicalURL = `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    updateMetaTag('link[rel="canonical"]', 'href', canonicalURL);
    updateMetaTag('meta[property="og:url"]', 'content', canonicalURL);
    updateMetaTag('meta[property="twitter:url"]', 'content', canonicalURL);

    const structuredDataElement = document.getElementById('structured-data');
    if (structuredDataElement) {
        structuredDataElement.textContent = structuredData ? JSON.stringify(structuredData, null, 2) : '';
    }

  }, [currentView, currentBlogPostSlug]);


  useEffect(() => {
    if (isLoadingRecommendation) {
      const intervalId = setInterval(() => {
        setCurrentLoadingMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000); 
      return () => clearInterval(intervalId);
    }
  }, [isLoadingRecommendation]);

  useEffect(() => {
    if (!isLoadingRecommendation && !isGenerating && recommendation?.text && !error && recommendationRef.current) {
      const timer = setTimeout(() => {
        recommendationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoadingRecommendation, isGenerating, recommendation, error]);


  const parseGeminiError = (err: any): string => {
    let errorMessage = 'Ocurrió un error desconocido al obtener las recomendaciones. Por favor, inténtalo de nuevo más tarde.';
    if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
        if (errorMessage.includes("got status: 502") && errorMessage.includes("Proxying failed")) {
            let details = "";
            try {
                const jsonErrorMatch = errorMessage.match(/{.*}/s);
                if (jsonErrorMatch && jsonErrorMatch[0]) {
                    const parsedJson = JSON.parse(jsonErrorMatch[0]);
                    if (parsedJson.details) {
                        details = ` Detalle técnico: ${parsedJson.details}.`;
                    } else if (parsedJson.error && parsedJson.proxiedUrl) {
                        details = ` Detalle técnico: ${parsedJson.error} al contactar ${new URL(parsedJson.proxiedUrl).hostname}.`;
                    }
                }
            } catch (e) { /* console.warn("Could not parse details from 502 error message:", e); */ }
            errorMessage = `Se encontró un problema de comunicación con un servicio intermediario (Error 502 Proxy).${details} Esto puede ser temporal. Por favor, inténtalo de nuevo en unos momentos. Si el problema persiste, verifica tu conexión a internet, o prueba desde otra red o navegador, ya que a veces configuraciones específicas pueden influir.`;
            return errorMessage;
        }
        // Do not suggest checking API_KEY for non-API_KEY related errors if not explicitly an API key error.
    } else if (typeof err === 'string') {
        errorMessage = err;
    } else if (err && typeof err.toString === 'function') {
        const errStr = err.toString();
        if (errStr !== '[object Object]') { 
            errorMessage = errStr;
        }
    }
    return errorMessage;
  };

  const extractLocationForWeather = (text: string): LocationForWeather | null => {
    const match = text.match(/---\s*\n\s*\*\*Datos para API de Clima \(Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN\):\*\*\s*\n\s*\*\s*CiudadPrincipal:\s*(.*?)\s*\n\s*\*\s*CodigoPais:\s*(.*?)\s*\n\s*\*\s*RegionOpcional:\s*(.*?)\s*\n\s*---/ms);

    if (match) {
        const cityName = match[1].trim();
        const countryCode = match[2].trim();
        const regionName = match[3].trim();
        if (cityName && countryCode) {
            console.log("Extracted for weather:", { cityName, countryCode, regionName: regionName || undefined });
            return { cityName, countryCode, regionName: regionName || undefined };
        }
    }
    console.warn("Could not extract location for weather from text:", text.slice(-500));
    return null;
  };

  const fetchAndSetWeatherData = async (location: LocationForWeather) => {
    setRecommendation(prev => prev ? { ...prev, isFetchingWeather: true, weatherError: null, isAwaitingLocationData: false } : null);

    try {
        const locationKey = await getAccuWeatherLocationKey(location);
        if (locationKey) {
            const weather = await getAccuWeatherForecast(locationKey);
            setRecommendation(prev => prev ? { ...prev, weatherData: weather, isFetchingWeather: false } : null);
        } else {
            setRecommendation(prev => prev ? { ...prev, weatherError: "No se pudo encontrar la clave de ubicación para el pronóstico del tiempo.", isFetchingWeather: false } : null);
        }
    } catch (err: any) {
        console.error("Error fetching weather data from AccuWeather:", err);
        let displayErrorMessage = `Error al obtener datos de AccuWeather: ${err.message || 'Error desconocido'}`;
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
            displayErrorMessage = "No se pudo conectar con el servicio meteorológico (AccuWeather). Esto podría deberse a un problema de red, un bloqueo por parte de tu navegador/antivirus, o a una interrupción temporal del servicio. Por favor, verifica tu conexión a internet e inténtalo de nuevo más tarde.";
        }
        setRecommendation(prev => prev ? { ...prev, weatherError: displayErrorMessage, isFetchingWeather: false } : null);
    }
  };

  const handleNavigateToMainApp = useCallback(() => {
    setCurrentView(AppView.MAIN_APP);
    setCurrentBlogPostSlug(null);
    updateURL(AppView.MAIN_APP);
  }, [updateURL]);
  
  const handleNavigateToBlogIndex = useCallback(() => {
    setCurrentView(AppView.BLOG_INDEX);
    setCurrentBlogPostSlug(null);
    updateURL(AppView.BLOG_INDEX);
  }, [updateURL]);

  const handleNavigateToBlogPost = useCallback((slug: string) => {
    const postExists = allBlogPosts.some(p => p.frontmatter.slug === slug);
    if (postExists) {
      setCurrentView(AppView.BLOG_POST);
      setCurrentBlogPostSlug(slug);
      updateURL(AppView.BLOG_POST, slug);
    } else {
      setCurrentView(AppView.NOT_FOUND);
      setCurrentBlogPostSlug(null);
      updateURL(AppView.NOT_FOUND);
    }
  }, [updateURL]);


  const handleGetRecommendations = useCallback(async (preferences: UserPreferences) => {
    setCurrentPreferences(preferences);
    setIsGenerating(true);
    setIsLoadingRecommendation(true);
    setError(null);
    setRecommendation({
        text: "",
        isFetchingWeather: false,
        weatherData: null,
        weatherError: null,
        isAwaitingLocationData: true
    });
    setActiveChatSession(null);
    if (currentView !== AppView.MAIN_APP) {
      setCurrentView(AppView.MAIN_APP); 
      setCurrentBlogPostSlug(null);
      updateURL(AppView.MAIN_APP);    
    }


    try {
      let accumulatedText = "";
      let streamHadContent = false;

      for await (const chunkText of generateBoatTripRecommendationStream(preferences)) {
        accumulatedText += chunkText;
        setRecommendation(prevRec => ({
          ...(prevRec ?? { text: "", isAwaitingLocationData: true }),
          text: accumulatedText,
        }));
        if (chunkText.trim() !== "") {
            streamHadContent = true;
        }
      }

      if (!streamHadContent && accumulatedText.trim() === "") {
        setError("La IA no generó una recomendación. Inténtalo de nuevo o ajusta tus preferencias.");
        setRecommendation({
            text: "",
            isFetchingWeather: false,
            weatherData: null,
            weatherError: null,
            isAwaitingLocationData: false
        });
      } else {
         const finalAccumulatedText = accumulatedText;
        setRecommendation(prev => prev ? {
            ...prev,
            text: finalAccumulatedText,
            isAwaitingLocationData: false // Mark as not awaiting even if location extraction fails
        } : {
            text: finalAccumulatedText,
            isFetchingWeather: false,
            weatherData: null,
            weatherError: null,
            isAwaitingLocationData: false
        });

        const locationForWeather = extractLocationForWeather(finalAccumulatedText);
        if (locationForWeather) {
            await fetchAndSetWeatherData(locationForWeather);
        } else {
            // Set error directly if location extraction fails, ensure isAwaitingLocationData is false.
            setRecommendation(prev => prev ? {
              ...prev,
              weatherError: "No se pudo determinar la ubicación para el pronóstico del clima a partir de la recomendación. Por favor, verifica los detalles de la ubicación principal proporcionada.",
              isFetchingWeather: false,
              isAwaitingLocationData: false 
            } : null);
        }

        const initialPromptForChat = constructPrompt(preferences);
        const geminiChat = aiInstance.current.chats.create({
            model: GEMINI_MODEL_NAME,
            config: { systemInstruction: "Eres un asistente experto en la planificación de viajes en barco. Ya has proporcionado una recomendación inicial. Ahora, ayuda al usuario a refinarla o responder preguntas adicionales sobre ella. Sé conciso y mantén el contexto del viaje propuesto y las preferencias originales." },
            history: [
                { role: 'user', parts: [{text: initialPromptForChat}] },
                { role: 'model', parts: [{text: finalAccumulatedText}] }
            ]
        });
        setActiveChatSession({
            id: Date.now().toString(),
            geminiChat: geminiChat,
            history: [],
            isLoading: false
        });
      }

    } catch (err) {
      console.error("Error in handleGetRecommendations (main try-catch):", err);
      setError(parseGeminiError(err));
      setRecommendation({
          text: "",
          isFetchingWeather: false,
          weatherData: null,
          weatherError: null,
          isAwaitingLocationData: false
      });
    } finally {
      setIsLoadingRecommendation(false);
      setIsGenerating(false);
    }
  }, [aiInstance, updateURL, currentView]); 

  const handleSendChatMessage = useCallback(async (messageContent: string) => {
    if (!activeChatSession || !messageContent.trim()) return;

    const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
    };

    setActiveChatSession(prev => prev ? { ...prev, history: [...prev.history, userMessage], isLoading: true } : null);

    try {
        const stream = await activeChatSession.geminiChat.sendMessageStream({ message: messageContent });
        let accumulatedModelResponse = "";
        let modelMessageId = `msg-model-${Date.now()}`;
        let firstChunk = true;

        for await (const chunk of stream) {
            const textChunk = chunk.text;
            accumulatedModelResponse += textChunk;
            if (firstChunk) {
                 const modelMessagePreview: ChatMessage = {
                    id: modelMessageId,
                    role: 'model',
                    content: accumulatedModelResponse,
                    timestamp: new Date().toISOString()
                };
                setActiveChatSession(prev => {
                    if (!prev) return null;
                    const existingMsgIndex = prev.history.findIndex(m => m.id === modelMessageId);
                    if (existingMsgIndex > -1) {
                        const updatedHistory = [...prev.history];
                        updatedHistory[existingMsgIndex] = modelMessagePreview;
                        return { ...prev, history: updatedHistory };
                    }
                    return { ...prev, history: [...prev.history, modelMessagePreview] };
                });
                firstChunk = false;
            } else {
                 setActiveChatSession(prev => {
                    if (!prev) return null;
                    const updatedHistory = prev.history.map(m =>
                        m.id === modelMessageId ? { ...m, content: accumulatedModelResponse } : m
                    );
                    return { ...prev, history: updatedHistory };
                });
            }
        }
    } catch (err) {
        console.error("Error sending chat message:", err);
        const errorMessageContent = `Error al obtener respuesta: ${parseGeminiError(err)}`;
        const errorMessage: ChatMessage = {
            id: `err-${Date.now()}`,
            role: 'model',
            content: errorMessageContent,
            timestamp: new Date().toISOString()
        };
         setActiveChatSession(prev => {
            if (!prev) return null;
            const lastMessage = prev.history[prev.history.length -1];
            if(lastMessage.role === 'user'){
                 return { ...prev, history: [...prev.history, errorMessage], isLoading: false };
            }
            const updatedHistory = prev.history.map(m =>
                m.id === lastMessage.id ? { ...m, content: errorMessageContent, timestamp: new Date().toISOString() } : m
            );
            return { ...prev, history: updatedHistory, isLoading: false };
        });
    } finally {
        setActiveChatSession(prev => prev ? { ...prev, isLoading: false } : null);
    }
  }, [activeChatSession]);

  const handlePrintPlan = () => {
    const recommendationElement = recommendationRef.current;
    const recommendationContentElement = recommendationElement?.querySelector('#recommendation-content');
    recommendationElement?.classList.add('printable-area-wrapper');
    recommendationContentElement?.classList.add('printable-area');
    window.print();
    recommendationElement?.classList.remove('printable-area-wrapper');
    recommendationContentElement?.classList.remove('printable-area');
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.MAIN_APP:
        return (
          <>
            <div className="w-full max-w-2xl no-print mb-6">
              <AndroidCompatibilityAlert />
            </div>
            <div
              className="w-full max-w-2xl no-print"
              style={{ position: 'relative', zIndex: 20 }}
            >
              <UserInputForm
                onSubmit={handleGetRecommendations}
                isLoading={isGenerating}
                cookieConsent={cookieConsent}
                onReconsiderCookies={handleReconsiderCookies}
              />
            </div>

            {showAds && AD_SLOT_ID_BANNER_CONTENT !== "YOUR_AD_SLOT_ID_BANNER_CONTENT" && (
              <div className="w-full max-w-3xl my-4 no-print">
                <AdSlot slotId={AD_SLOT_ID_BANNER_CONTENT} adClientId={AD_CLIENT_ID} className="min-h-[100px] bg-slate-200 flex items-center justify-center text-slate-500" />
              </div>
            )}

            <div ref={recommendationRef} className="w-full max-w-3xl">
              <RecommendationCard
                recommendation={recommendation}
                isLoading={isLoadingRecommendation}
                error={error}
                chatSession={activeChatSession}
                onSendChatMessage={handleSendChatMessage}
                onPrintPlan={handlePrintPlan}
              />
            </div>
          </>
        );
      case AppView.BLOG_INDEX:
        return <BlogIndexPage onNavigateToPost={handleNavigateToBlogPost} onNavigateHome={handleNavigateToMainApp} />;
      case AppView.BLOG_POST:
        return <BlogPostPage 
                  slug={currentBlogPostSlug} 
                  onNavigateToBlogIndex={handleNavigateToBlogIndex} 
                  onNavigateHome={handleNavigateToMainApp} 
                  onNavigateToPost={handleNavigateToBlogPost} 
                />;
      case AppView.NOT_FOUND:
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} />;
      default:
        console.error("RenderContent: currentView is an unexpected value", currentView);
        return <NotFoundPage onNavigateHome={handleNavigateToMainApp} />;
    }
  };

  return (
    <div className="main-container app-font">
      <MobileOptimizations />
      <Header 
        title={APP_TITLE} 
        onNavigateHome={handleNavigateToMainApp}
        onNavigateToBlogIndex={handleNavigateToBlogIndex}
        currentView={currentView}
      />
      <main className="flex-grow w-full">
        <div className="flex flex-col items-center gap-8">
          {renderContent()}
        </div>
      </main>
      <Footer
        onShowPrivacyPolicy={() => setShowPrivacyModal(true)}
        onShowTermsOfService={() => setShowTermsModal(true)}
        onNavigateToMainApp={handleNavigateToMainApp} 
        onNavigateToBlogIndex={handleNavigateToBlogIndex}
        showAds={showAds}
        currentView={currentView}
      />
      {isLoadingRecommendation && <LoadingOverlay message={currentLoadingMessage} />}
      {showPrivacyModal && <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsOfServiceModal onClose={() => setShowTermsModal(false)} />}
      {cookieConsent === CookieConsentStatus.PENDING && (
        <CookieConsentBanner
          onAccept={handleCookieConsent}
          onDecline={handleCookieDecline}
          onShowPrivacyPolicy={() => setShowPrivacyModal(true)}
          onShowTermsOfService={() => setShowTermsModal(true)}
        />
      )}
      {(currentView === AppView.BLOG_INDEX || currentView === AppView.BLOG_POST || currentView === AppView.MAIN_APP) && <ScrollToTopButton />}
      <PWAInstallPrompt />
    </div>
  );
};

export default App;