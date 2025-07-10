// Configuración segura para variables de entorno
interface AppConfig {
  GEMINI_API_KEY: string;
  ACCUWEATHER_API_KEY: string;
  GA_TRACKING_ID: string;
  GTM_ID: string;
  BASE_URL: string;
  SHOW_ADS: boolean;
  ENABLE_GOOGLE_ANALYTICS: boolean;
  ENABLE_GOOGLE_TAG_MANAGER: boolean;
  ENABLE_WEATHER_SERVICE: boolean;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

// Función para validar y obtener variables de entorno de forma segura
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  
  // En desarrollo, mostrar advertencias si faltan claves importantes
  if (import.meta.env.DEV && !value && key === 'VITE_GEMINI_API_KEY') {
    console.warn(`⚠️  ${key} no está configurada. La funcionalidad de IA no estará disponible.`);
    console.warn('   Crea un archivo .env.local con tu clave API de Google Gemini.');
  }
  
  return value || defaultValue || '';
};

// Función para validar que las claves API tienen el formato correcto
const validateApiKey = (key: string, type: 'gemini' | 'accuweather'): boolean => {
  if (!key || key === 'MISSING_API_KEY' || key.includes('your_')) {
    return false;
  }
  
  // Validaciones básicas de formato
  if (type === 'gemini') {
    return key.startsWith('AIza') && key.length > 30;
  }
  
  if (type === 'accuweather') {
    return key.length > 20;
  }
  
  return true;
};

// Configuración para desarrollo local
const LOCAL_CONFIG: AppConfig = {
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY', 'MISSING_API_KEY'),
  ACCUWEATHER_API_KEY: getEnvVar('VITE_ACCUWEATHER_API_KEY', 'cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE'),
  GA_TRACKING_ID: getEnvVar('VITE_GA_MEASUREMENT_ID', 'G-2Q5EJ94KNR'),
  GTM_ID: getEnvVar('VITE_GTM_ID', 'GTM-W92QTGF4'),
  BASE_URL: getEnvVar('VITE_BASE_URL', 'http://localhost:5173'),
  SHOW_ADS: false,
  ENABLE_GOOGLE_ANALYTICS: false,
  ENABLE_GOOGLE_TAG_MANAGER: false,
  ENABLE_WEATHER_SERVICE: validateApiKey(getEnvVar('VITE_ACCUWEATHER_API_KEY'), 'accuweather'),
  IS_DEVELOPMENT: true,
  IS_PRODUCTION: false,
};

// Configuración para producción
const PRODUCTION_CONFIG: AppConfig = {
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY', 'MISSING_API_KEY'),
  ACCUWEATHER_API_KEY: getEnvVar('VITE_ACCUWEATHER_API_KEY', ''),
  GA_TRACKING_ID: getEnvVar('VITE_GA_MEASUREMENT_ID', ''),
  GTM_ID: getEnvVar('VITE_GTM_ID', ''),
  BASE_URL: getEnvVar('VITE_BASE_URL', 'https://boattrip-planner.com'),
  SHOW_ADS: true,
  ENABLE_GOOGLE_ANALYTICS: !!getEnvVar('VITE_GA_MEASUREMENT_ID'),
  ENABLE_GOOGLE_TAG_MANAGER: !!getEnvVar('VITE_GTM_ID'),
  ENABLE_WEATHER_SERVICE: validateApiKey(getEnvVar('VITE_ACCUWEATHER_API_KEY'), 'accuweather'),
  IS_DEVELOPMENT: false,
  IS_PRODUCTION: true,
};

// Función para obtener la configuración según el entorno
export const getConfig = (): AppConfig => {
  const isDevelopment = import.meta.env.DEV;
  const config = isDevelopment ? LOCAL_CONFIG : PRODUCTION_CONFIG;
  
  // Validar configuración crítica
  if (!validateApiKey(config.GEMINI_API_KEY, 'gemini')) {
    console.warn('⚠️  Clave API de Gemini no válida o faltante');
  }
  
  return config;
};

// Función para verificar si la API está disponible
export const isApiAvailable = (): boolean => {
  const config = getConfig();
  return validateApiKey(config.GEMINI_API_KEY, 'gemini');
};

// Función para obtener configuración de desarrollo
export const getDevelopmentConfig = (): AppConfig => LOCAL_CONFIG;

// Función para obtener configuración de producción
export const getProductionConfig = (): AppConfig => PRODUCTION_CONFIG; 