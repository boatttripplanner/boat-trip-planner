import { NextRequest, NextResponse } from 'next/server';

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getWeather(destination: string) {
  try {
  // 1. Buscar location key de AccuWeather
  const locRes = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(destination)}`);
  const locData = await locRes.json();
  if (!locData[0]?.Key) return null;
  const locationKey = locData[0].Key;
    
  // 2. Obtener pronóstico diario para los próximos 5 días
  const forecastRes = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&metric=true`);
  const forecastData = await forecastRes.json();
  return forecastData.DailyForecasts || null;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

async function getPexelsImages(query: string, count: number = 6) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`, {
    headers: { Authorization: PEXELS_API_KEY || "" },
  });
  const data = await res.json();
  return (data.photos || []).map((p: unknown) => (p as { src: { large: string } }).src.large);
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
}

async function getPexelsImage(query: string) {
  try {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
    headers: { Authorization: PEXELS_API_KEY || "" },
  });
  const data = await res.json();
  return data.photos?.[0]?.src?.large || null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}

async function generateMapUrl(destination: string, routePoints?: string[]) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      return `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=${encodeURIComponent(destination)}&key=DEMO_KEY`;
    }
    
    let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (routePoints && routePoints.length > 0) {
      const path = routePoints.map(point => encodeURIComponent(point)).join('|');
      mapUrl += `&path=color:0x0099ff|weight:3|${path}`;
    }
    
    return mapUrl;
  } catch (error) {
    console.error('Error generating map URL:', error);
    return null;
  }
}

async function generateAISections(preferences: {
  destination: string;
  boatType?: string;
  numPeople: number;
  experience: string;
  activities?: string[];
  budgetLevel?: string;
  startDate?: string;
  numTripDays?: number;
}, weatherData: {
  Date?: string;
  Temperature?: {
    Minimum?: { Value?: number; Unit?: string };
    Maximum?: { Value?: number; Unit?: string };
  };
  Day?: {
    Icon?: number;
    IconPhrase?: string;
    Wind?: { 
      Speed?: { Value?: number; Unit?: string }; 
      Direction?: { Degrees?: number; Localized?: string } 
    };
  };
  Night?: {
    Icon?: number;
    IconPhrase?: string;
    Wind?: { 
      Speed?: { Value?: number; Unit?: string }; 
      Direction?: { Degrees?: number; Localized?: string } 
    };
  };
}[] | null) {
  try {
    const prompt = `Eres un experto en viajes en barco y navegación con amplia experiencia en planificación de rutas marítimas. Genera una recomendación COMPLETA y DETALLADA para un viaje a ${preferences.destination} con las siguientes características:

**DETALLES DEL VIAJE:**
- Destino: ${preferences.destination}
- Tipo de barco: ${preferences.boatType || 'No especificado'}
- Número de personas: ${preferences.numPeople}
- Experiencia del capitán: ${preferences.experience}
- Actividades deseadas: ${preferences.activities?.join(', ') || 'No especificadas'}
- Presupuesto: ${preferences.budgetLevel || 'No especificado'}
- Fechas: ${preferences.startDate || 'No especificadas'}
- Duración: ${preferences.numTripDays || 1} día(s)

**INFORMACIÓN METEOROLÓGICA DISPONIBLE:**
${weatherData ? `- Condiciones: ${weatherData[0]?.Day?.IconPhrase || 'Desconocido'}
- Temperatura máxima: ${weatherData[0]?.Temperature?.Maximum?.Value || '-'}°C
- Temperatura mínima: ${weatherData[0]?.Temperature?.Minimum?.Value || '-'}°C
- Viento: ${weatherData[0]?.Day?.Wind?.Speed?.Value || '-'} ${weatherData[0]?.Day?.Wind?.Speed?.Unit || 'km/h'}
- Dirección del viento: ${weatherData[0]?.Day?.Wind?.Direction?.Localized || 'No especificada'}` : 'No disponible'}

**INSTRUCCIONES ESPECÍFICAS:**
Genera el contenido en formato Markdown con las siguientes secciones OBLIGATORIAS y COMPLETAS:

## 🗺️ Datos Clave de Navegación
- Coordenadas aproximadas del destino
- Profundidades típicas de la zona
- Corrientes marinas principales
- Reglamentación local y restricciones
- Zonas de fondeo recomendadas
- Distancia desde puerto base (si aplica)
- Tiempo estimado de navegación

## 📋 Resumen del Viaje
- Resumen ejecutivo del viaje propuesto
- Duración total estimada
- Tipo de experiencia que vivirá el usuario
- Puntos destacados del itinerario
- Mejor época para realizar este viaje

## 🧭 Itinerario Detallado
- **HORARIO COMPLETO** con horas específicas
- Rutas paso a paso con distancias exactas
- Tiempos estimados de navegación
- Puertos/calas de interés con coordenadas
- Puntos de fondeo recomendados
- Actividades específicas en cada parada
- Restaurantes y servicios en ruta
- Consejos de navegación para cada tramo

## ✅ Checklist de Preparación
- **DOCUMENTACIÓN:** Licencias, seguros, documentación del barco
- **EQUIPAMIENTO DE SEGURIDAD:** Chalecos, bengalas, radio VHF, botiquín
- **EQUIPAMIENTO NÁUTICO:** Anclas, cabos, defensas, instrumentos
- **PROVISIONES:** Agua, comida, combustible, aceite
- **EQUIPAMIENTO PERSONAL:** Ropa, calzado, protección solar
- **ACTIVIDADES ESPECÍFICAS:** Equipo de snorkel, pesca, deportes acuáticos
- **TECNOLOGÍA:** GPS, cargadores, baterías externas
- **COMODIDADES:** Toallas, ropa de cama, utensilios de cocina

## ⚠️ Consejos y Advertencias
- **METEOROLÓGICOS:** Basados en el pronóstico actual
- **DE SEGURIDAD:** Específicos para la zona y tipo de barco
- **REGLAMENTARIOS:** Leyes locales, permisos necesarios
- **PRÁCTICOS:** Consejos de navegación, fondeo, amarres
- **EMERGENCIA:** Números de contacto, procedimientos
- **CONSERVACIÓN:** Prácticas sostenibles, respeto al medio ambiente

## 🌟 Actividades y Lugares Extra
- **RESTAURANTES:** Recomendaciones específicas con precios
- **PUNTOS DE INTERÉS:** Monumentos, miradores, lugares históricos
- **SPORTS ACUÁTICOS:** Snorkel, buceo, paddle surf, kayak
- **ACTIVIDADES CULTURALES:** Museos, mercados, eventos locales
- **FOTOGRAFÍA:** Mejores spots para fotos, horarios óptimos
- **RELAJACIÓN:** Playas tranquilas, spas, actividades wellness

## 📞 Información de Contacto
- **EMERGENCIAS:** Guardia Civil, Salvamento Marítimo, Bomberos
- **SERVICIOS NÁUTICOS:** Marinas, talleres, suministros
- **AUTORIDADES PORTUARIAS:** Capitanías, aduanas
- **EMPRESAS LOCALES:** Alquiler de equipos, guías, servicios
- **COMUNICACIONES:** Radio VHF, teléfonos importantes
- **INFORMACIÓN TURÍSTICA:** Oficinas de turismo, información local

**IMPORTANTE:** 
- Sé específico con horarios, distancias y coordenadas
- Incluye precios aproximados cuando sea relevante
- Adapta las recomendaciones al nivel de experiencia del usuario
- Considera las condiciones meteorológicas en todas las recomendaciones
- Haz el contenido práctico y accionable

Responde SOLO con el contenido en Markdown, sin explicaciones adicionales.`;

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
    
  const data = await res.json();
    console.log('🔍 Gemini raw response:', JSON.stringify(data, null, 2));
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log('🔍 Gemini AI content:', aiText);
    return aiText;
  } catch (error) {
    console.error('Error generating AI sections:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, dates, boatType, interests, ...preferences } = body;

    // Validar datos requeridos
    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destino es requerido' },
        { status: 400 }
      );
    }

    // Preparar datos de preferencias completos
    const completePreferences = {
      destination,
      boatType: boatType || 'Velero',
      numPeople: preferences.numPeople || 2,
      experience: preferences.experience || 'beginner_needs_skipper',
      activities: interests || preferences.activities || ['Snorkel'],
      budgetLevel: preferences.budgetLevel || 'standard',
      startDate: dates || preferences.startDate || new Date().toISOString().split('T')[0],
      numTripDays: preferences.numTripDays || 1
    };

    // 1. Obtener datos meteorológicos
    let weatherData = null;
    try {
      weatherData = await getWeather(destination);
      console.log('Weather data fetched successfully');
    } catch (error) {
      console.error('Weather fetch error:', error);
    }

    // 2. Obtener imágenes
    let mainImage = null;
    let galleryImages = [];
    try {
      const imageQuery = `${destination} ${completePreferences.boatType} sailing boat`;
      mainImage = await getPexelsImage(imageQuery);
      galleryImages = await getPexelsImages(imageQuery, 8);
      console.log('Images fetched successfully');
    } catch (error) {
      console.error('Image fetch error:', error);
    }

    // 3. Generar mapa
    let mapUrl = null;
    try {
      mapUrl = await generateMapUrl(destination);
      console.log('Map generated successfully');
    } catch (error) {
      console.error('Map generation error:', error);
    }

    // 4. Generar contenido AI estructurado
    let aiContent = null;
    try {
      console.log('Generating AI content with preferences:', completePreferences);
      aiContent = await generateAISections(completePreferences, weatherData);
      console.log('AI content generated successfully');
    } catch (error) {
      console.error('AI content generation error:', error);
    }

    // 5. Preparar datos meteorológicos estructurados
    const structuredWeatherData = weatherData ? {
      date: weatherData[0]?.Date || new Date().toISOString(),
      temperatureMin: weatherData[0]?.Temperature?.Minimum?.Value || 0,
      temperatureMax: weatherData[0]?.Temperature?.Maximum?.Value || 0,
      temperatureUnit: weatherData[0]?.Temperature?.Maximum?.Unit || 'C',
      dayIconPhrase: weatherData[0]?.Day?.IconPhrase || '',
      dayWindSpeed: weatherData[0]?.Day?.Wind?.Speed?.Value || 0,
      dayWindUnit: weatherData[0]?.Day?.Wind?.Speed?.Unit || 'km/h',
      dayWindDirection: weatherData[0]?.Day?.Wind?.Direction?.Localized || '',
      nightIconPhrase: weatherData[0]?.Night?.IconPhrase || '',
      nightWindSpeed: weatherData[0]?.Night?.Wind?.Speed?.Value || 0,
      nightWindUnit: weatherData[0]?.Night?.Wind?.Speed?.Unit || 'km/h',
      nightWindDirection: weatherData[0]?.Night?.Wind?.Direction?.Localized || '',
      accuWeatherDayIcon: weatherData[0]?.Day?.Icon || 0,
      accuWeatherNightIcon: weatherData[0]?.Night?.Icon || 0
    } : null;

    // 6. Preparar respuesta estructurada
    const response = {
      success: true,
      data: {
    destination,
    dates,
        boatType: completePreferences.boatType,
        interests: completePreferences.activities,
        weatherData: structuredWeatherData,
        mainImage,
        galleryImages,
    mapUrl,
        aiContent,
        sections: {
          weather: structuredWeatherData,
          images: galleryImages,
          map: mapUrl,
          content: aiContent
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          preferences: completePreferences,
          hasWeather: !!structuredWeatherData,
          hasImages: galleryImages.length > 0,
          hasMap: !!mapUrl,
          hasContent: !!aiContent
        }
      }
    };

    console.log('API response prepared successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 