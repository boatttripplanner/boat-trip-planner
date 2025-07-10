
import { ACCUWEATHER_API_KEY, ACCUWEATHER_BASE_URL } from '../constants';
import { WeatherData, AccuWeatherLocationResponse, AccuWeatherForecastResponse } from '../types';

const genericErrorMessage = "No se pudo obtener la información meteorológica en este momento. Inténtalo más tarde.";

interface LocationInfo {
  cityName: string;
  countryCode: string;
  regionName?: string;
}

export async function getLocationKey(locationInfo: LocationInfo): Promise<string | null> {
  if (ACCUWEATHER_API_KEY === "cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE" && !process.env.ACCUWEATHER_API_KEY) {
     console.warn(
      "ADVERTENCIA: Se está utilizando una clave API de AccuWeather predeterminada/de demostración. " +
      "Esta clave es para fines de desarrollo y prueba únicamente, y puede tener límites de uso muy estrictos o dejar de funcionar. " +
      "Para un funcionamiento fiable de la previsión meteorológica, por favor, configura tu propia clave API de AccuWeather en la variable de entorno 'ACCUWEATHER_API_KEY'."
    );
  } else if (!ACCUWEATHER_API_KEY || ACCUWEATHER_API_KEY === "MISSING_ACCUWEATHER_API_KEY") { 
    console.error('Clave API de AccuWeather no configurada en constants.ts. Esto no debería ocurrir.');
    throw new Error('Clave API de AccuWeather no configurada internamente.');
  }

  const queryTextForAPI = locationInfo.cityName;
  
  const locationUrl = `${ACCUWEATHER_BASE_URL}/locations/v1/cities/${locationInfo.countryCode}/search?apikey=${ACCUWEATHER_API_KEY}&q=${encodeURIComponent(queryTextForAPI)}&language=es-es`;
  
  try {
    const response = await fetch(locationUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error ${response.status} fetching AccuWeather location key for query "${queryTextForAPI}" in country "${locationInfo.countryCode}": ${errorData.Message || response.statusText}`);
      throw new Error(`Error al buscar ubicación en AccuWeather: ${errorData.Message || response.statusText}`);
    }
    const data: AccuWeatherLocationResponse[] = await response.json();
    
    if (data && data.length > 0) {
      let bestMatch = data[0]; // Initial best guess

      // Refine if regionName is provided and there are multiple results
      if (locationInfo.regionName && data.length > 1) {
        const potentialMatchesByRegion = data.filter(loc => 
          loc.AdministrativeArea?.LocalizedName?.toLowerCase().includes(locationInfo.regionName!.toLowerCase())
        );

        if (potentialMatchesByRegion.length > 0) {
          // Prefer a match where LocalizedName (city name) also starts with the input cityName
          let refinedMatch = potentialMatchesByRegion.find(pm => 
            pm.LocalizedName?.toLowerCase().startsWith(locationInfo.cityName.toLowerCase())
          );
          
          if (refinedMatch) {
            bestMatch = refinedMatch;
          } else {
            // If no strong cityName match among regionMatches, take the first regionMatch.
            // This prioritizes matching the region if a perfect city name start isn't found.
            bestMatch = potentialMatchesByRegion[0]; 
          }
        }
        // If potentialMatchesByRegion.length is 0 (no entries matched the region name), 
        // bestMatch remains data[0], which is an acceptable fallback.
      }
      return bestMatch.Key;
    }
    console.warn(`No location key found for AccuWeather query "${queryTextForAPI}" in country "${locationInfo.countryCode}" (Original details: City: ${locationInfo.cityName}, Region: ${locationInfo.regionName || 'N/A'}).`);
    return null;
  } catch (error) {
    console.error('Error in getLocationKey (AccuWeather):', error);
    throw error; 
  }
}

export async function getWeatherForecast(locationKey: string): Promise<WeatherData | null> {
   if (ACCUWEATHER_API_KEY === "cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE" && !process.env.ACCUWEATHER_API_KEY) {
     // Warning is already shown in getLocationKey if called sequentially.
   } else if (!ACCUWEATHER_API_KEY || ACCUWEATHER_API_KEY === "MISSING_ACCUWEATHER_API_KEY") {
    console.error('Clave API de AccuWeather no configurada en constants.ts para pronóstico.');
    throw new Error('Clave API de AccuWeather no configurada internamente para pronóstico.');
  }

  const forecastUrl = `${ACCUWEATHER_BASE_URL}/forecasts/v1/daily/5day/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=es-es&details=true&metric=true`;

  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error ${response.status} fetching AccuWeather forecast for key "${locationKey}": ${errorData.Message || response.statusText}`);
      throw new Error(`Error al obtener pronóstico de AccuWeather: ${errorData.Message || response.statusText}`);
    }
    const data: AccuWeatherForecastResponse = await response.json();

    if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
      const forecast = data.DailyForecasts[0]; 
      return {
        date: forecast.Date,
        temperatureMin: forecast.Temperature.Minimum.Value,
        temperatureMax: forecast.Temperature.Maximum.Value,
        temperatureUnit: forecast.Temperature.Minimum.Unit,
        accuWeatherDayIcon: forecast.Day.Icon,
        dayIconPhrase: forecast.Day.IconPhrase,
        dayWindSpeed: forecast.Day.Wind.Speed.Value,
        dayWindDirection: forecast.Day.Wind.Direction.Localized,
        dayWindUnit: forecast.Day.Wind.Speed.Unit,
        accuWeatherNightIcon: forecast.Night.Icon,
        nightIconPhrase: forecast.Night.IconPhrase,
        nightWindSpeed: forecast.Night.Wind.Speed.Value,
        nightWindDirection: forecast.Night.Wind.Direction.Localized,
        nightWindUnit: forecast.Night.Wind.Speed.Unit,
        link: forecast.Link,
      };
    }
    return null;
  } catch (error) {
    console.error('Error in getWeatherForecast (AccuWeather):', error);
    throw error; 
  }
}

export const getAccuWeatherIconUrl = (iconNumber: number): string => {
  const numStr = iconNumber < 10 ? `0${iconNumber}` : iconNumber.toString();
  return `https://developer.accuweather.com/sites/default/files/${numStr}-s.png`;
};
