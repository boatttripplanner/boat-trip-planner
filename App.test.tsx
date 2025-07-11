import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the Gemini service
vi.mock('./services/geminiService', () => ({
  generateRecommendation: vi.fn(() => Promise.resolve({
    recommendation: 'Test recommendation',
    itinerary: 'Test itinerary'
  }))
}));

// Mock the weather service
vi.mock('./services/accuweatherService', () => ({
  getWeatherData: vi.fn(() => Promise.resolve({
    temperature: 25,
    description: 'Sunny'
  }))
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<App />);
    // Look for the heading specifically in the header
    const header = screen.getByRole('banner');
    expect(header).toHaveTextContent('BoatTrip Planner');
  });

  it('renders the user input form', () => {
    render(<App />);
    expect(screen.getByText('Planifica tu viaje en barco')).toBeInTheDocument();
  });

  it('shows the wizard steps', () => {
    render(<App />);
    // Check for step numbers in the progress indicator
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('allows navigation between wizard steps', async () => {
    render(<App />);
    
    // Find and click the next button (Siguiente)
    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(nextButton);
    
    // Wait for the next step to appear (step 2 should be active)
    await waitFor(() => {
      const step2 = screen.getByText('2').closest('div');
      expect(step2).toHaveClass('bg-gradient-to-br', 'from-blue-500', 'via-cyan-500', 'to-teal-500');
    });
  });

  it('shows form elements for planning mode selection', () => {
    render(<App />);
    
    // Check that planning mode options are available
    expect(screen.getByRole('button', { name: /quiero alquilar un barco/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tengo mi propio barco/i })).toBeInTheDocument();
  });

  it('shows experience type options when planning mode is selected', async () => {
    render(<App />);
    
    // Select planning mode first
    const rentalButton = screen.getByRole('button', { name: /quiero alquilar un barco/i });
    fireEvent.click(rentalButton);
    
    // Check that experience type options are available
    expect(screen.getByRole('button', { name: /día completo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /varios días/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /medio día\/mañana/i })).toBeInTheDocument();
  });
}); 