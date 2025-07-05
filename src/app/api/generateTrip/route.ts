import { NextRequest, NextResponse } from 'next/server';

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function getWeather(destination: string) {
  // 1. Buscar location key de AccuWeather
  const locRes = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(destination)}`);
  const locData = await locRes.json();
  if (!locData[0]?.Key) return null;
  const locationKey = locData[0].Key;
  // 2. Obtener pronóstico diario para los próximos 5 días
  const forecastRes = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&metric=true`);
  const forecastData = await forecastRes.json();
  return forecastData.DailyForecasts || null;
}

async function getPexelsImages(query: string) {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
    headers: { Authorization: PEXELS_API_KEY || "" },
  });
  const data = await res.json();
  return (data.photos || []).map((p: unknown) => (p as { src: { large: string } }).src.large);
}

async function getPexelsImage(query: string) {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
    headers: { Authorization: PEXELS_API_KEY || "" },
  });
  const data = await res.json();
  return data.photos?.[0]?.src?.large || null;
}

async function getGeminiSections(prompt: string) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Intentar parsear las secciones como JSON si es posible
  try {
    return JSON.parse(text);
  } catch {
    return { description: text };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, dates, boatType, interests } = body;

    console.log('API generateTrip called with:', { destination, dates, boatType, interests });

    // 1. Clima
    let weather = null;
    let weatherError = null;
    try {
      weather = await getWeather(destination);
      console.log('Weather data retrieved successfully');
    } catch (error) {
      weatherError = 'No se pudo obtener información meteorológica';
      console.error('Weather API error:', error);
    }

    // 2. Imagen principal
    let image = null;
    let imageError = null;
    try {
      image = await getPexelsImage(`${destination} ${boatType}`);
      console.log('Main image retrieved successfully');
    } catch (error) {
      imageError = 'No se pudo obtener imagen principal';
      console.error('Pexels API error (main image):', error);
    }

    // 3. Galería de imágenes
    let gallery = [];
    let galleryError = null;
    try {
      gallery = await getPexelsImages(`${destination} ${boatType}`);
      console.log('Gallery images retrieved successfully');
    } catch (error) {
      galleryError = 'No se pudo obtener galería de imágenes';
      console.error('Pexels API error (gallery):', error);
    }

    // 4. Mapa de ruta (placeholder, sin API key)
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=${encodeURIComponent(destination)}&path=color:0x0099ff|weight:3|${encodeURIComponent(destination)}`;

    // Prompt estructurado para Gemini
    const geminiPrompt = `Eres un experto en viajes en barco. Genera una recomendación personalizada para un viaje a ${destination} en un ${boatType}, con intereses: ${interests?.join(", ")}. El clima previsto es: ${weather?.[0]?.Day?.IconPhrase || "desconocido"} y temperaturas máximas de ${weather?.[0]?.Temperature?.Maximum?.Value || "-"}°C. Devuelve un JSON con las siguientes claves:

{
  "itinerary": "Itinerario diario con rutas, distancias, tiempos, puertos/calas y consejos locales",
  "weatherTips": "Consejos y advertencias meteorológicas para la ruta",
  "recommendedStops": "Playas, calas, restaurantes, puntos de interés, spots de deportes acuáticos",
  "practicalTips": "Consejos prácticos: combustible, agua, provisiones, tarifas, reglas locales",
  "captainTips": "Consejos para capitanes y tripulación: experiencia, licencias, fondeo nocturno, avisos legales",
  "experience": "Frase emocional sobre el tipo de experiencia que vivirá el usuario"
}

Responde solo con el JSON, sin explicaciones extra.`;

    let geminiSections = {};
    let geminiError = null;
    try {
      geminiSections = await getGeminiSections(geminiPrompt);
      console.log('Gemini response received:', Object.keys(geminiSections));
      
      // Verificar que tenemos contenido útil de Gemini
      if (!geminiSections || Object.keys(geminiSections).length === 0) {
        geminiError = 'No se pudo generar contenido personalizado';
      }
    } catch (error) {
      geminiError = 'Error al generar recomendación personalizada';
      console.error('Gemini API error:', error);
    }

    const response = {
      destination,
      dates,
      boatType,
      interests,
      weather,
      image,
      gallery,
      mapUrl,
      ...geminiSections,
      // Información de errores para debugging
      errors: {
        weather: weatherError,
        image: imageError,
        gallery: galleryError,
        gemini: geminiError
      }
    };

    console.log('API response prepared successfully');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Unexpected error in generateTrip API:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor. Por favor, inténtalo de nuevo.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 