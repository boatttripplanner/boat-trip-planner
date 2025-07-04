
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserPreferences, ExperienceLevel, experienceLevelOptions, DesiredExperienceType, desiredExperienceTypeOptions, BoatTransferDetails, BoatingLicenseType, boatingLicenseTypeOptions, BudgetLevel, PlanningMode } from '../types';
import { GEMINI_MODEL_NAME, budgetLevelOptions, SYSTEM_NAUTICAL_PLANNER_PROMPT, planningModeOptions } from '../constants';

const geminiApiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || "MISSING_API_KEY";

if (geminiApiKey === "MISSING_API_KEY") {
  console.error("La variable de entorno API_KEY no está configurada para Gemini. Las llamadas a la API de Gemini fallarán.");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey }); 

export const constructPrompt = (preferences: UserPreferences): string => {
  const desiredExperienceTypeOption = desiredExperienceTypeOptions.find(opt => opt.value === preferences.desiredExperienceType);
  const desiredExperienceTypeDisplay = desiredExperienceTypeOption ? desiredExperienceTypeOption.label : 'No especificado';
  
  const planningModeOption = planningModeOptions.find(opt => opt.value === preferences.planningMode);
  const planningModeDisplay = planningModeOption ? planningModeOption.label : 'No especificado';

  let prompt = SYSTEM_NAUTICAL_PLANNER_PROMPT;

  prompt = prompt.replace('{planning_mode}', planningModeDisplay);
  
  if (preferences.planningMode === PlanningMode.OWN_BOAT && preferences.boatTransferDetails) {
    let boatDetailsOwnStr = "";
    if (preferences.boatTransferDetails.model) boatDetailsOwnStr += `Modelo: ${preferences.boatTransferDetails.model}, `;
    if (preferences.boatTransferDetails.length) boatDetailsOwnStr += `Eslora: ${preferences.boatTransferDetails.length}m, `;
    // Add other relevant details
    boatDetailsOwnStr = boatDetailsOwnStr.length > 0 ? boatDetailsOwnStr.slice(0, -2) : "Detalles no especificados";
    prompt = prompt.replace('{boat_details_own}', boatDetailsOwnStr);
    prompt = prompt.replace('{barco_rental_preference}', "N/A (Barco Propio)");
  } else {
    prompt = prompt.replace('{boat_details_own}', "N/A (Alquiler)");
    prompt = prompt.replace('{barco_rental_preference}', preferences.boatType || "No especificado");
  }

  prompt = prompt.replace('{zona}', preferences.destination);
  prompt = prompt.replace('{dias}', preferences.numTripDays ? preferences.numTripDays.toString() : (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY ? "Varios (usuario especificará)" : "1"));
  
  const experienceOption = experienceLevelOptions.find(opt => opt.value === preferences.experience);
  prompt = prompt.replace('{experiencia}', experienceOption ? experienceOption.label : "No especificado");
  
  let prefsStr = "";
  if (preferences.activities.length > 0) prefsStr += `Actividades: ${preferences.activities.join(', ')}. `;
  if (preferences.otherActivities) prefsStr += `Otras: ${preferences.otherActivities}. `;
  // Add other preferences as needed
  prompt = prompt.replace('{preferencias}', prefsStr.length > 0 ? prefsStr : "No especificadas");


  prompt += `

---
**A continuación, los detalles proporcionados por el usuario para su solicitud de viaje en barco:**
`;

  prompt += `*   **Modo de Planificación:** ${planningModeDisplay}\n`;

  const experienceDisplay = experienceOption ? experienceOption.label : 'No especificado';

  prompt += `*   **Tipo de Experiencia Deseada por el Usuario:** ${desiredExperienceTypeDisplay}\n`;
  
  if (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY) {
    if (preferences.numTripDays) {
      prompt += `    *   **Número de Días para la Experiencia 'Varios Días':** ${preferences.numTripDays} días\n`;
    }
    if (preferences.isSamePortForMultiDay === true || preferences.isSamePortForMultiDay === undefined) { 
      prompt += `    *   **Logística de Puertos (Varios Días):** Salida y llegada desde el mismo puerto: ${preferences.destination} (IA: si es posible, investiga y menciona el canal VHF de este puerto en la sección de Información Práctica).\n`;
      prompt += `    *   **Instrucción para la IA (Ruta Varios Días - Mismo Puerto):** Planifica una ruta que comience y termine en ${preferences.destination}, optimizada para ${preferences.numTripDays} días.\n`;
    } else if (preferences.isSamePortForMultiDay === false && preferences.arrivalPortForMultiDay) {
      prompt += `    *   **Logística de Puertos (Varios Días):** Salida desde: ${preferences.destination} (IA: si es posible, investiga y menciona el canal VHF del puerto de salida en la sección de Información Práctica), Llegada a: ${preferences.arrivalPortForMultiDay} (IA: si es posible, investiga y menciona el canal VHF del puerto de llegada en la sección de Información Práctica).\n`;
      prompt += `    *   **Instrucción para la IA (Ruta Varios Días - Puertos Diferentes):** Planifica una ruta de solo ida desde ${preferences.destination} hasta ${preferences.arrivalPortForMultiDay}, optimizada para ${preferences.numTripDays} días.\n`;
    }
    if (preferences.multiDayTripNotes) {
      prompt += `    *   **Notas Específicas del Usuario para el Viaje de Varios Días:** ${preferences.multiDayTripNotes}\n`;
      prompt += `    *   **Instrucción para la IA (Notas Multi-Día):** Presta MUCHA ATENCIÓN a estas notas específicas del usuario al diseñar el itinerario detallado de varios días, incluyendo paradas, actividades y ritmo del viaje.\n`;
    }
  }


  if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
    prompt += `*   **Puerto de Origen (para el Traslado):** ${preferences.destination} (IA: si es posible, investiga y menciona el canal VHF de este puerto en la sección de Información Práctica).\n`;
    if (preferences.transferDestinationPort) {
      prompt += `*   **Puerto de Destino (para el Traslado):** ${preferences.transferDestinationPort} (IA: si es posible, investiga y menciona el canal VHF de este puerto en la sección de Información Práctica).\n`;
    } else {
      prompt += `*   **Puerto de Destino (para el Traslado):** No especificado (IA debe considerar esto)\n`;
    }
    prompt += `*   **Instrucción Específica para Traslados (Itinerario y Horario):** En la sección "Destino e Itinerario Sugerido", detalla un horario estimado del traslado (ej. Salida: 08:00, Llegada estimada: 16:00). El traslado debe ser directo a menos que sea necesario parar por repostaje o seguridad. Justifica cualquier parada propuesta y que sea precise. Si no se proporcionaron detalles de la embarcación, asume una autonomía razonable para la distancia, pero considera paradas técnicas para traslados muy largos (>150-200 millas náuticas si lo ves necesario).\n`;

  } else if (preferences.desiredExperienceType !== DesiredExperienceType.MULTI_DAY) { 
    prompt += `*   **Puerto de Salida/Destino Principal Deseado (para ${desiredExperienceTypeDisplay}):** ${preferences.destination} (IA: si es posible, investiga y menciona el canal VHF de este puerto en la sección de Información Práctica).\n`;
  }
  
  if (preferences.boatTransferDetails) {
    const context = preferences.planningMode === PlanningMode.OWN_BOAT 
                    ? "(embarcación propia del usuario)" 
                    : preferences.desiredExperienceType === DesiredExperienceType.TRANSFER 
                      ? "para el Traslado" 
                      : "(preferencias para alquiler)";
    prompt += `*   **Especificaciones de la Embarcación ${context} (proporcionadas por el usuario):**\n`;
    if (preferences.boatTransferDetails.model) prompt += `    *   Modelo: ${preferences.boatTransferDetails.model}\n`;
    if (preferences.boatTransferDetails.length) prompt += `    *   Eslora: ${preferences.boatTransferDetails.length} (metros)\n`;
    if (preferences.boatTransferDetails.beam) prompt += `    *   Manga: ${preferences.boatTransferDetails.beam} (metros)\n`;
    if (preferences.boatTransferDetails.draft) prompt += `    *   Calado: ${preferences.boatTransferDetails.draft} (metros)\n`;
    if (preferences.boatTransferDetails.cruisingSpeed) prompt += `    *   Velocidad de Crucero: ${preferences.boatTransferDetails.cruisingSpeed} (nudos)\n`;
    if (preferences.boatTransferDetails.tankCapacity) prompt += `    *   Capacidad del Depósito: ${preferences.boatTransferDetails.tankCapacity} (litros)\n`;
    if (preferences.boatTransferDetails.averageConsumption) prompt += `    *   Consumo Medio: ${preferences.boatTransferDetails.averageConsumption} (litros/hora)\n`;

    if (preferences.planningMode === PlanningMode.OWN_BOAT) {
        prompt += `    *   **Instrucción para la IA (Barco Propio):** El usuario utilizará SU PROPIA EMBARCACIÓN con estas especificaciones. El plan DEBE ser adecuado y optimizado para ESTA EMBARCACIÓN. No sugieras otros tipos de barco a menos que sea para comparar o si la embarcación actual es claramente inadecuada (explícalo). Evalúa la idoneidad para rutas, puertos, autonomía (crucero, depósito, consumo) y paradas técnicas.\n`;
    } else if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
        prompt += `    *   **Instrucción para la IA (Traslado con detalles de la embarcación):** Al generar la recomendación, especialmente en las secciones 'Tipo de Embarcación Recomendada' y 'Destino Detallado e Itinerario Sugerido (o Detalles del Traslado)', debes tener muy en cuenta estas especificaciones. Si se proporcionó un modelo, enfócate en esa embarcación. Utiliza los datos de eslora, manga y calado para evaluar la idoneidad de rutas y puertos. Considera la velocidad de crucero, capacidad del depósito y consumo para estimar la duración del viaje, la autonomía y la posible necesidad de paradas para repostar combustible. Sé directo y claro en estas evaluaciones técnicas.\n`;
    } else { // Rental with preferences
        prompt += `    *   **Instrucción para la IA (Alquiler con Preferencias de Barco):** El usuario ha proporcionado estas preferencias para el barco de ALQUILER. Sugiere un tipo/modelo de alquiler que se ajuste a estas características, o explica si son difíciles de encontrar para la zona/presupuesto y ofrece alternativas.\n`;
    }
  } else { 
    if (preferences.planningMode === PlanningMode.RENTAL) {
        if (preferences.desiredExperienceType === DesiredExperienceType.TRANSFER) {
            prompt += `*   **Embarcación para el Traslado (tipo general):** No especificado por el usuario (IA debe sugerir un tipo/modelo adecuado para el traslado y las condiciones, de forma clara y justificada).\n`;
        } else {
            prompt += `*   **Tipo de Embarcación Preferida (por el usuario, para alquiler):** No especificado (IA debe sugerir opciones ideales basadas en el resto de preferencias y el Tipo de Experiencia Deseada, describiéndolas de forma profesional y clara)\n`;
        }
    } else if (preferences.planningMode === PlanningMode.OWN_BOAT) {
        prompt += `*   **Especificaciones de la Embarcación Propia:** No proporcionadas por el usuario. **Instrucción para la IA:** Como el usuario usará su propio barco pero no dio detalles, haz recomendaciones generales para un tipo de barco versátil (ej. crucero a motor de 10-12m o velero similar) adecuado para la zona, o pide al usuario que considere las características de su barco.\n`;
    }
  }
  
  prompt += `*   **Número de Personas:** ${preferences.numPeople}\n`;
  prompt += `*   **Nivel de Experiencia Náutica del Solicitante:** ${experienceDisplay}\n`;

  if (preferences.boatingLicense && 
      (preferences.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || 
       preferences.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE ||
       preferences.planningMode === PlanningMode.OWN_BOAT)) {
    const licenseOption = boatingLicenseTypeOptions.find(opt => opt.value === preferences.boatingLicense);
    const licenseDisplay = licenseOption ? licenseOption.label : 'No especificada';
    prompt += `    *   **Titulación Náutica Específica:** ${licenseDisplay}\n`;
  }

  // Skipper logic based on planningMode and experience
  if (preferences.planningMode === PlanningMode.OWN_BOAT) {
    if (preferences.experience === ExperienceLevel.BEGINNER_NEEDS_SKIPPER || preferences.experience === ExperienceLevel.BASIC_KNOWLEDGE_PREFERS_SKIPPER) {
        prompt += `    *   **Instrucción CRÍTICA para la IA (Barco Propio, Poca Experiencia):** Usuario tiene su propio barco pero su nivel de experiencia es ${experienceDisplay}. DEBES RECOMENDAR ENFÁTICAMENTE que cuente con un patrón profesional o una persona cualificada a bordo para garantizar la seguridad y el disfrute. Explica los beneficios claramente.\n`;
    } else { // Experienced or Expert with own boat
        prompt += `    *   **Instrucción para la IA (Barco Propio, Experimentado):** Usuario es ${experienceDisplay} y utiliza su propio barco. ASUME que el usuario operará la embarcación o ha organizado un patrón. NO sugieras un patrón a menos que el plan sea excepcionalmente complejo y lo justifiques. Tu recomendación debe ser para navegación SIN patrón como base.\n`;
    }
  } else { // RENTAL mode
      if (preferences.experience === ExperienceLevel.BEGINNER_NEEDS_SKIPPER) {
        prompt += `    *   **Instrucción CRÍTICA para la IA (Alquiler, Principiante):** Usuario es ${experienceDisplay} y quiere alquilar. DEBES RECOMENDAR ENFÁTICAMENTE un patrón, explicando los beneficios de forma clara y persuasiva.\n`;
      } else if (preferences.experience === ExperienceLevel.BASIC_KNOWLEDGE_PREFERS_SKIPPER) {
        prompt += `    *   **Instrucción para la IA (Alquiler, Nociones Básicas):** Usuario es ${experienceDisplay} y quiere alquilar. Recomienda un patrón como la opción ideal, de forma clara y amable.\n`;
      } else if (preferences.experience === ExperienceLevel.EXPERIENCED_WITH_LICENSE_NO_SKIPPER || preferences.experience === ExperienceLevel.EXPERT_ADVANCED_LICENSE) {
        prompt += `    *   **Instrucción para la IA (Alquiler, Experimentado):** Usuario es ${experienceDisplay} y quiere alquilar. Reconoce su capacidad para gobernar. La recomendación principal debe ser para alquiler SIN patrón (bareboat), a menos que el tipo de embarcación/destino lo haga inusual o legalmente requerido. Si indicó titulación, considérala. Comunica esto de forma profesional y clara.\n`;
      }
  }


  let dateInfo = `Desde ${preferences.startDate}`;
  if (preferences.endDate) {
    dateInfo += ` hasta ${preferences.endDate}`;
  } else {
    dateInfo += ` (Fecha de fin no especificada)`;
  }
  if (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY && preferences.numTripDays) {
      dateInfo += ` (Total: ${preferences.numTripDays} días)`;
  }
  prompt += `*   **Fechas Preferidas/Duración:** ${dateInfo}\n`;
  
  if (preferences.desiredExperienceType === DesiredExperienceType.MULTI_DAY && preferences.numTripDays) {
    prompt += `    *   **Instrucción para la IA (Varios Días - Duración):** El usuario ha especificado un viaje de ${preferences.numTripDays} días. La sección "Destino e Itinerario Sugerido" debe detallar un itinerario para esta duración exacta. No sugieras una duración diferente. Haz que este itinerario sea lógico y bien presentado.\n`;
  }

  if (preferences.budgetLevel === BudgetLevel.SPECIFIC_AMOUNT) {
    if (preferences.customBudgetAmount && preferences.customBudgetAmount > 0) {
      prompt += `*   **Nivel de Presupuesto (por el usuario):** Monto Específico: ${preferences.customBudgetAmount} EUR\n`;
      prompt += `    *   **Instrucción para la IA (Presupuesto Específico):** El usuario ha indicado un presupuesto exacto de ${preferences.customBudgetAmount} EUR. Adapta todas las sugerencias (tipo de barco, duración si es factible, extras, comidas, etc.) para que se ajusten estrictamente a este monto. Si el presupuesto parece demasiado bajo o alto para la experiencia solicitada, por favor, indícalo de forma amable y sugiere ajustes realistas al plan o al presupuesto.\n`;
    } else {
      prompt += `*   **Nivel de Presupuesto (por el usuario):** Monto Específico (cantidad no proporcionada/inválida)\n`;
      prompt += `    *   **Instrucción para la IA (Monto Específico Inválido):** El usuario seleccionó 'Monto Específico' pero no proporcionó una cantidad válida. Basa la recomendación en un nivel 'Estándar'. Menciona que los costos pueden variar y que especificar un presupuesto puede ayudar a refinar el plan.\n`;
    }
  } else if (preferences.budgetLevel) { 
    const budgetOption = budgetLevelOptions.find(opt => opt.value === preferences.budgetLevel);
    prompt += `*   **Nivel de Presupuesto (por el usuario):** ${budgetOption ? budgetOption.label : preferences.budgetLevel}\n`;
    prompt += `    *   **Instrucción para la IA (Presupuesto por Nivel):** Considera este nivel de presupuesto al elaborar el plan.\n`;
  } else { 
    prompt += `*   **Nivel de Presupuesto (por el usuario):** No especificado\n`;
    prompt += `    *   **Instrucción para la IA (Presupuesto No Especificado):** El usuario no ha indicado un presupuesto. Ofrece una recomendación basada en un nivel 'Estándar'. Menciona que los costos pueden variar y que especificar un presupuesto puede ayudar a refinar el plan.\n`;
  }

  if (preferences.budgetNotes) { // Se refiere a las notas generales del viaje
    prompt += `*   **Notas Adicionales del Usuario sobre el Viaje (MUY IMPORTANTE):** ${preferences.budgetNotes}\n`;
    prompt += `    *   **Instrucción para la IA (Notas Adicionales Generales):** Estas son notas importantes del usuario que pueden afectar destinos, ruta, tipo de experiencia, o restricciones (ej. no querer amarres en puerto). DEBES TENERLAS MUY EN CUENTA al diseñar TODO el plan.\n`;
  }


  if (preferences.desiredExperienceType !== DesiredExperienceType.TRANSFER && preferences.activities && preferences.activities.length > 0) {
    prompt += `*   **Actividades Deseadas (lista principal):** ${preferences.activities.join(', ')}\n`;
  } else if (preferences.desiredExperienceType !== DesiredExperienceType.TRANSFER) {
    prompt += `*   **Actividades Deseadas (lista principal):** No especificadas (IA debe sugerir actividades relevantes para el Tipo de Experiencia Deseada, descritas de forma profesional y clara)\n`;
  } else {
     prompt += `*   **Actividades Deseadas (lista principal):** No aplicable directamente (es un traslado)\n`;
  }

  if (preferences.otherActivities) {
    prompt += `*   **Otras Actividades o Solicitudes Especiales (por el usuario):** ${preferences.otherActivities}\n`;
  }
  
  prompt += `
Ahora, por favor, genera la recomendación detallada, con un enfoque profesional y experto, para este usuario, siguiendo estrictamente TODAS las directrices de contenido, estructura, tono (profesional, claro, informativo, experto, conciso, fácil de escanear, convincente, bien fundamentado, impecable, preciso, estructurado, pulido) indicadas anteriormente, y prestando ESPECIAL ATENCIÓN a adaptar toda la recomendación al "Tipo de Experiencia Deseada": ${desiredExperienceTypeDisplay} y al "Modo de Planificación": ${planningModeDisplay}.
Asegúrate de incluir el bloque "Datos para API de Clima (Uso Interno - NO MOSTRAR COMO SECCIÓN PRINCIPAL EN EL ACORDEÓN)" al final de tu respuesta, completando los campos CiudadPrincipal, CodigoPais y RegionOpcional basados en la recomendación principal. Por ejemplo, si la recomendación es para "Port de Palma (Palma de Mallorca, Spain)", CiudadPrincipal sería "Palma de Mallorca", CodigoPais "ES", y RegionOpcional "Mallorca" o "Islas Baleares".
`;
  return prompt;
};

export async function* generateBoatTripRecommendationStream(preferences: UserPreferences): AsyncGenerator<string, void, undefined> {
  if (geminiApiKey === "MISSING_API_KEY") { 
    console.error("Error: La API_KEY de Google Gemini no está configurada en el entorno.");
    throw new Error("La API_KEY no está configurada. Por favor, asegúrate de que la variable de entorno API_KEY esté definida correctamente. No se puede conectar a la API de Gemini.");
  }
  
  const prompt = constructPrompt(preferences);
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.6, 
        topK: 40,
        topP: 0.95,
      }
    });
    
    let yieldedContent = false;
    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText && chunkText.trim() !== "") {
        yieldedContent = true;
        yield chunkText;
      } else if (chunkText === "") { 
        yield ""; 
      }
    }

    if (!yieldedContent) {
        console.warn("Advertencia: El stream de la IA se completó sin generar contenido textual significativo para el prompt:", prompt.substring(0, 500) + "..."); 
    }

  } catch (error) {
    console.error("Error llamando a la API de Gemini o durante el streaming:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || 
            error.message.includes("API_KEY_INVALID") || 
            error.message.toLowerCase().includes("permission denied") || 
            error.message.toLowerCase().includes("api key is missing") ||
            error.message.toLowerCase().includes("authentication failed")) { 
             throw new Error("Error de autenticación con la API de Gemini: Clave API inválida, con permisos insuficientes, o no proporcionada. Por favor, verifica la configuración de tu clave API (API_KEY) en el entorno.");
        }
        const geminiError = error as any; 
        if (geminiError?.message?.toLowerCase().includes("blocked") || 
            geminiError?.response?.promptFeedback?.blockReason || 
            geminiError?.promptFeedback?.blockReason) {
             const blockReason = geminiError?.response?.promptFeedback?.blockReason || geminiError?.promptFeedback?.blockReason || "no especificada";
             console.warn("Respuesta bloqueada por la API de Gemini. Razón:", blockReason);
             throw new Error(`Tu solicitud no pudo ser procesada porque el contenido fue bloqueado por razones de seguridad o política de la IA (Razón: ${blockReason}). Intenta reformular tus preferencias.`);
        }
         throw new Error(`La solicitud a la API de Gemini falló con el mensaje: ${error.message}. Por favor, inténtalo de nuevo más tarde.`);
    }
    throw new Error("Ocurrió un error desconocido al comunicarse con la API de Gemini. Por favor, inténtalo de nuevo más tarde.");
  }
}
