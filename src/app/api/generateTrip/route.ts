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
  const body = await req.json();
  const { destination, dates, boatType, interests } = body;

  // 1. Clima
  let weather = null;
  try {
    weather = await getWeather(destination);
  } catch {}

  // 2. Imagen principal
  let image = null;
  try {
    image = await getPexelsImage(`${destination} ${boatType}`);
  } catch {}

  // 3. Galería de imágenes
  let gallery = [];
  try {
    gallery = await getPexelsImages(`${destination} ${boatType}`);
  } catch {}

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
  try {
    geminiSections = await getGeminiSections(geminiPrompt);
    console.log('Gemini response:', geminiSections);
  } catch {}

  return NextResponse.json({
    destination,
    dates,
    boatType,
    interests,
    weather,
    image,
    gallery,
    mapUrl,
    ...geminiSections,
  });
} 