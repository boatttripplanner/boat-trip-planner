# 🔒 Configuración Segura - BoatTrip Planner

Este documento describe cómo configurar las APIs y variables de entorno de forma segura.

## 🚨 Variables de Entorno Críticas

### 🤖 Google Gemini API (Requerido)

**Propósito**: Generar recomendaciones de viajes en barco con IA.

**Configuración**:

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Configura en `.env.local`:

   ```env
   VITE_GEMINI_API_KEY=AIzaSyC...
   ```

**Seguridad**:

- ✅ Nunca commits la clave API al repositorio
- ✅ Usa variables de entorno en producción
- ✅ Configura límites de uso en Google AI Studio
- ✅ Monitorea el uso de la API

### 🌤️ AccuWeather API (Opcional)

**Propósito**: Información meteorológica para destinos náuticos.

**Configuración**:

1. Regístrate en [AccuWeather Developer](https://developer.accuweather.com/)
2. Obtén tu API key
3. Configura en `.env.local`:

   ```env
   VITE_ACCUWEATHER_API_KEY=your_key_here
   ```

## 🔧 Configuración Local

### Método 1: Script Automático (Recomendado)

```bash
npm run setup-env
```

Este script te guiará paso a paso para configurar todas las variables.

### Método 2: Manual

1. Copia el archivo de ejemplo:

   ```bash
   cp env.example .env.local
   ```

2. Edita `.env.local` con tus claves API:

   ```env
   VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
   VITE_ACCUWEATHER_API_KEY=tu_clave_accuweather_aqui
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_GTM_ID=GTM-XXXXXXX
   VITE_BASE_URL=http://localhost:5173
   ```

## 🌐 Configuración de Producción

### GitHub Actions Secrets

Para deployment automático, configura estos secrets en tu repositorio:

1. Ve a `Settings` > `Secrets and variables` > `Actions`
2. Agrega los siguientes secrets:

   - `VITE_GEMINI_API_KEY`
   - `VITE_ACCUWEATHER_API_KEY`
   - `VITE_GA_MEASUREMENT_ID`
   - `VITE_GTM_ID`

### Validación Automática

El workflow de GitHub Actions validará automáticamente:

- ✅ Presencia de claves API críticas
- ✅ Formato correcto de las claves
- ✅ Configuración de variables opcionales

## 🛡️ Medidas de Seguridad

### Validación de Claves API

El sistema valida automáticamente:

- **Gemini API**: Debe empezar con `AIza` y tener al menos 30 caracteres
- **AccuWeather API**: Debe tener al menos 20 caracteres
- **Google Analytics**: Formato `G-XXXXXXXXXX`
- **Google Tag Manager**: Formato `GTM-XXXXXXX`

### Manejo de Errores

- ❌ Claves inválidas o faltantes
- ❌ Errores de red
- ❌ Límites de uso excedidos
- ❌ Errores de autenticación

### Logs y Monitoreo

- 📊 Logs de errores en consola (desarrollo)
- 📊 Validación automática en CI/CD
- 📊 Advertencias para claves faltantes

## 🔍 Verificación de Configuración

### Verificar Configuración Local

```bash
# Verificar tipos TypeScript
npm run type-check

# Iniciar servidor de desarrollo
npm run dev
```

### Verificar Configuración de Producción

El workflow de GitHub Actions verificará:

- ✅ Build exitoso
- ✅ Variables de entorno válidas
- ✅ Deployment a GitHub Pages

## 🚨 Troubleshooting

### Error: "API de Gemini no disponible"

**Causa**: Clave API no configurada o inválida.

**Solución**:

1. Verifica que `VITE_GEMINI_API_KEY` esté en `.env.local`
2. Asegúrate de que la clave sea válida
3. Verifica que no haya espacios extra

### Error: "Límite de uso de la API alcanzado"

**Causa**: Se excedió el límite de uso de la API.

**Solución**:

1. Verifica el uso en Google AI Studio
2. Considera aumentar el límite
3. Implementa rate limiting si es necesario

### Error: "Error de conexión"

**Causa**: Problemas de red o API no disponible.

**Solución**:

1. Verifica tu conexión a internet
2. Intenta más tarde
3. Verifica el estado de las APIs

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Revisa los logs** en la consola del navegador
2. **Verifica la documentación** de las APIs
3. **Crea un issue** en GitHub con detalles del error

## 🔄 Actualización de Claves

Para actualizar claves API:

1. **Desarrollo**: Edita `.env.local`
2. **Producción**: Actualiza los secrets en GitHub
3. **Verifica**: Ejecuta el workflow de CI/CD

---

**Recuerda**: Nunca compartas tus claves API públicamente. Mantén siempre la seguridad de tus credenciales. 