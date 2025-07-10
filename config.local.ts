// Configuración para desarrollo local
export const LOCAL_CONFIG = {
  // API Keys para desarrollo
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "MISSING_API_KEY",
  ACCUWEATHER_API_KEY: import.meta.env.VITE_ACCUWEATHER_API_KEY || "cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE",
  
  // Configuración de analytics para desarrollo
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || "G-2Q5EJ94KNR",
  GTM_ID: import.meta.env.VITE_GTM_ID || "GTM-W92QTGF4",
  
  // URLs para desarrollo
  BASE_URL: "http://localhost:5173",
  
  // Configuración de ads para desarrollo (deshabilitados)
  SHOW_ADS: false,
  
  // Configuración de servicios externos
  ENABLE_GOOGLE_ANALYTICS: false,
  ENABLE_GOOGLE_TAG_MANAGER: false,
  ENABLE_WEATHER_SERVICE: true,
};

// Función para obtener la configuración según el entorno
export const getConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return LOCAL_CONFIG;
  }
  
  // Configuración para producción
  return {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "MISSING_API_KEY",
    ACCUWEATHER_API_KEY: import.meta.env.VITE_ACCUWEATHER_API_KEY || "cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE",
    GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || "G-2Q5EJ94KNR",
    GTM_ID: import.meta.env.VITE_GTM_ID || "GTM-W92QTGF4",
    BASE_URL: "https://www.boattrip-planner.com",
    SHOW_ADS: true,
    ENABLE_GOOGLE_ANALYTICS: true,
    ENABLE_GOOGLE_TAG_MANAGER: true,
    ENABLE_WEATHER_SERVICE: true,
  };
}; 