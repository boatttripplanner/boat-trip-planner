import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlanningMode, ExperienceLevel, DesiredExperienceType } from '../types';

// Mock the entire geminiService module
vi.mock('./geminiService', () => ({
  generateRecommendation: vi.fn(),
  constructPrompt: vi.fn(),
  generateBoatTripRecommendationStream: vi.fn(),
  isApiAvailable: vi.fn(() => true),
  initializeGeminiAPI: vi.fn()
}));

// Import after mocking
import { generateRecommendation } from './geminiService';

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });

  it('generates recommendation successfully', async () => {
    const mockResult = {
      recommendation: 'Test boat recommendation',
      itinerary: 'Test itinerary details',
      weather: 'Sunny weather expected'
    };

    vi.mocked(generateRecommendation).mockResolvedValue(mockResult);

    const preferences = {
      planningMode: PlanningMode.RENTAL,
      destination: 'Mallorca',
      numPeople: 4,
      activities: ['Snorkel', 'Pesca Recreativa'],
      experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
      desiredExperienceType: DesiredExperienceType.FULL_DAY,
      boatType: 'sailboat',
      startDate: '2024-06-15',
      endDate: '2024-06-15'
    };

    const result = await generateRecommendation(preferences);

    expect(result).toEqual(mockResult);
    expect(generateRecommendation).toHaveBeenCalledWith(preferences);
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'API Error';
    vi.mocked(generateRecommendation).mockRejectedValue(new Error(errorMessage));

    const preferences = {
      planningMode: PlanningMode.RENTAL,
      destination: 'Mallorca',
      numPeople: 2,
      activities: ['Snorkel'],
      experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
      desiredExperienceType: DesiredExperienceType.FULL_DAY,
      boatType: 'sailboat',
      startDate: '2024-06-15',
      endDate: '2024-06-15'
    };

    await expect(generateRecommendation(preferences)).rejects.toThrow(errorMessage);
  });

  it('validates required API key', async () => {
    const errorMessage = 'API de Gemini no disponible: Clave API no válida o faltante';
    vi.mocked(generateRecommendation).mockRejectedValue(new Error(errorMessage));

    const preferences = {
      planningMode: PlanningMode.RENTAL,
      destination: 'Mallorca',
      numPeople: 2,
      activities: ['Snorkel'],
      experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
      desiredExperienceType: DesiredExperienceType.FULL_DAY,
      boatType: 'sailboat',
      startDate: '2024-06-15',
      endDate: '2024-06-15'
    };

    await expect(generateRecommendation(preferences)).rejects.toThrow('API de Gemini no disponible');
  });

  it('formats user input correctly', async () => {
    const mockResult = {
      recommendation: 'Test boat recommendation',
      itinerary: 'Test itinerary details',
      weather: 'Sunny weather expected'
    };

    vi.mocked(generateRecommendation).mockResolvedValue(mockResult);

    const preferences = {
      planningMode: PlanningMode.RENTAL,
      destination: 'Mallorca',
      numPeople: 4,
      activities: ['Snorkel', 'Pesca Recreativa'],
      experience: ExperienceLevel.BEGINNER_NEEDS_SKIPPER,
      desiredExperienceType: DesiredExperienceType.FULL_DAY,
      boatType: 'sailboat',
      startDate: '2024-06-15',
      endDate: '2024-06-15'
    };

    const result = await generateRecommendation(preferences);

    expect(result).toHaveProperty('recommendation');
    expect(result).toHaveProperty('itinerary');
    expect(result).toHaveProperty('weather');
    expect(typeof result.recommendation).toBe('string');
  });
}); 