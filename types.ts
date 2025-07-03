

import type { Chat } from "@google/genai";

export interface BoatTransferDetails {
  model?: string;
  averageConsumption?: string; // e.g., "20 L/h"
  tankCapacity?: string;     // e.g., "500 L"
  cruisingSpeed?: string;    // e.g., "20 knots"
  beam?: string;             // e.g., "4.5 m"
  length?: string;           // e.g., "15 m"
  draft?: string;            // e.g., "2.2 m"
}

export enum BudgetLevel {
  ECONOMY = 'economy',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  LUXURY = 'luxury',
  SPECIFIC_AMOUNT = 'specific_amount' 
}

export enum PlanningMode {
  OWN_BOAT = 'own_boat',
  RENTAL = 'rental',
}

export const planningModeOptions: { value: PlanningMode; label: string }[] = [
  { value: PlanningMode.RENTAL, label: 'Quiero Alquilar un Barco' },
  { value: PlanningMode.OWN_BOAT, label: 'Mi Barco Propio' },
];

export interface UserPreferences {
  planningMode: PlanningMode; 
  destination: string;
  numPeople: number;
  budgetLevel?: BudgetLevel; 
  customBudgetAmount?: number; 
  budgetNotes?: string;     
  activities: string[];
  boatType?: string; 
  experience: ExperienceLevel;
  startDate?: string;
  endDate?: string;
  transferDestinationPort?: string;
  otherActivities?: string;
  desiredExperienceType: DesiredExperienceType;
  boatTransferDetails?: BoatTransferDetails;
  numTripDays?: number;
  isSamePortForMultiDay?: boolean;
  arrivalPortForMultiDay?: string;
  boatingLicense?: BoatingLicenseType;
  multiDayTripNotes?: string;
}

export interface WeatherData {
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  temperatureUnit: string;
  dayIconPhrase: string;
  dayWindSpeed: number;
  dayWindUnit: string;
  dayWindDirection?: string;
  nightIconPhrase?: string;
  nightWindSpeed?: number;
  nightWindUnit?: string;
  nightWindDirection?: string;
  link?: string;
  accuWeatherDayIcon?: number;
  accuWeatherNightIcon?: number;
}

export interface Recommendation {
  text: string;
  chatHistory?: ChatMessage[]; 
  weatherData?: WeatherData | null;
  weatherError?: string | null;
  isFetchingWeather?: boolean;
  isAwaitingLocationData?: boolean; 
}

export enum DesiredExperienceType {
  FULL_DAY = 'full_day',
  HALF_DAY_MORNING = 'half_day_morning',
  HALF_DAY_AFTERNOON = 'half_day_afternoon',
  SUNSET = 'sunset',
  MULTI_DAY = 'multi_day',
  TRANSFER = 'transfer'
}

export const desiredExperienceTypeOptions: { value: DesiredExperienceType; label: string }[] = [
  { value: DesiredExperienceType.FULL_DAY, label: 'Día Completo' },
  { value: DesiredExperienceType.HALF_DAY_MORNING, label: 'Medio Día/Mañana' },
  { value: DesiredExperienceType.HALF_DAY_AFTERNOON, label: 'Medio Día/Tarde' },
  { value: DesiredExperienceType.SUNSET, label: 'Puesta de Sol (Sunset)' },
  { value: DesiredExperienceType.MULTI_DAY, label: 'Varios Días' },
  { value: DesiredExperienceType.TRANSFER, label: 'Traslado (Solo Transporte)' },
];

export enum ExperienceLevel {
  BEGINNER_NEEDS_SKIPPER = 'beginner_needs_skipper',
  BASIC_KNOWLEDGE_PREFERS_SKIPPER = 'basic_knowledge_prefers_skipper',
  EXPERIENCED_WITH_LICENSE_NO_SKIPPER = 'experienced_with_license_no_skipper',
  EXPERT_ADVANCED_LICENSE = 'expert_advanced_license',
}

export const experienceLevelOptions: { value: ExperienceLevel; label: string }[] = [
  { value: ExperienceLevel.BEGINNER_NEEDS_SKIPPER, label: 'Principiante (necesita patrón, sin experiencia)' },
  { value: ExperienceLevel.BASIC_KNOWLEDGE_PREFERS_SKIPPER, label: 'Con Nociones Básicas (puede ayudar, prefiere patrón)' },
  { value: ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER, label: 'Experimentado (con licencia, puede navegar solo)' },
  { value: ExperienceLevel.EXPERT_ADVANCED_LICENSE, label: 'Experto (licencia avanzada, busca desafíos)' },
];

export enum BoatingLicenseType {
  NO_LICENSE = 'no_license',
  LNB = 'lnb',
  PNB = 'pnb',
  PER = 'per',
  PER_EXTENDED = 'per_extended',
  PY = 'py',
  CY = 'cy'
}

export const boatingLicenseTypeOptions: { value: BoatingLicenseType; label: string }[] = [
  { value: BoatingLicenseType.NO_LICENSE, label: 'Sin Titulación / No Requerida' },
  { value: BoatingLicenseType.LNB, label: 'LNB (Licencia de Navegación)' },
  { value: BoatingLicenseType.PNB, label: 'PNB (Patrón de Navegación Básica)' },
  { value: BoatingLicenseType.PER, label: 'PER (Patrón de Embarcaciones de Recreo)' },
  { value: BoatingLicenseType.PER_EXTENDED, label: 'PER Ampliado (Habilitación Baleares/Vela)' },
  { value: BoatingLicenseType.PY, label: 'PY (Patrón de Yate)' },
  { value: BoatingLicenseType.CY, label: 'Capitán de Yate)' }
];

export const activityOptions: string[] = [
  'Snorkel',
  'Pesca Recreativa',
  'Visitar Calas Escondidas',
  'Deportes Acuáticos (Esquí, Wakeboard, Donut)',
  'Tomar el Sol y Relajarse en Cubierta',
  'Navegación a Vela (si aplica)',
  'Celebraciones Especiales (Cumpleaños, Aniversarios)',
  'Observación de Puestas de Sol desde el Mar',
  'Paddle Surf (SUP)',
  'Kayak o Canoa',
  'Buceo (con equipo propio o guía)',
  'Comida o Picnic a Bordo',
  'Visitar Puertos Pintorescos y Paseos Marítimos',
  'Exploración Costera y Cuevas Marinas',
  'Avistamiento de Delfines o Fauna Marina (si es posible)',
  'Fotografía Paisajística y Marina',
  "Buceo con botella (submarinismo)"
];

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type ChatRole = 'user' | 'model';

export interface AppChatSession {
  id: string; 
  geminiChat: Chat; 
  history: ChatMessage[]; 
  isLoading: boolean;
}

// Type for custom checklist items
export interface CustomChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

// AccuWeather API specific types
export interface AccuWeatherLocationResponse {
  Key: string;
  LocalizedName: string;
  Country: { ID: string };
  AdministrativeArea: { ID: string; LocalizedName: string };
}

export interface AccuWeatherForecastResponse {
  DailyForecasts: {
    Date: string;
    Temperature: {
      Minimum: { Value: number; Unit: string };
      Maximum: { Value: number; Unit: string };
    };
    Day: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Night: {
      Icon: number;
      IconPhrase: string;
      Wind: { Speed: { Value: number; Unit: string }; Direction: { Degrees: number; Localized: string } };
    };
    Link: string;
  }[];
}

// App View Management
export enum AppView {
  MAIN_APP = 'main_app',
  NOT_FOUND = 'not_found',
  BLOG_INDEX = 'blog_index',
  BLOG_POST = 'blog_post',
}

// Cookie Consent Status
export enum CookieConsentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined', 
}

export interface UserInputFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
  cookieConsent: CookieConsentStatus;
  onReconsiderCookies: () => void; // Added
}

export interface WizardStepProps {
  data: UserPreferences;
  updateData: (fields: Partial<UserPreferences>) => void;
  isPrimaryInputDisabled: boolean;
  onReconsiderCookies: () => void;
}

export interface WizardNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    isLoading: boolean;
    isNextDisabled?: boolean;
}

export interface HeaderProps {
  title: string;
  onNavigateHome: () => void;
  onNavigateToBlogIndex?: () => void; 
  currentView: AppView;
}


export interface FooterProps {
  onShowPrivacyPolicy: () => void;
  onShowTermsOfService: () => void;
  onNavigateToMainApp: () => void;
  onNavigateToBlogIndex?: () => void;
  showAds: boolean; 
  currentView: AppView;
}

export interface NotFoundPageProps {
  onNavigateHome: () => void;
}

// Blog specific types
export interface BlogPostFrontmatter {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  author?: string;
  summary: string;
  featuredImage?: string; // Path to image, e.g., /images/blog/my-post.jpg
  tags?: string[];
}

export interface ParsedMarkdownPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
}

export interface BlogIndexPageProps {
  onNavigateToPost: (slug: string) => void;
  onNavigateHome: () => void;
}

export interface BlogPostPageProps {
  slug: string | null;
  onNavigateToBlogIndex: () => void;
  onNavigateHome: () => void;
  onNavigateToPost: (slug: string) => void;
}
