# BoatTrip Planner 🚤

Una aplicación web que proporciona recomendaciones personalizadas para el alquiler de barcos utilizando IA, simplificando el proceso de planificación de viajes náuticos.

## 🚀 Desarrollo Local

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd boattrip-planner
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Variables de entorno para desarrollo local
   
   # Gemini API Key (necesaria para la funcionalidad de IA)
   VITE_GEMINI_API_KEY=tu_clave_api_de_gemini_aqui
   
   # AccuWeather API Key (opcional, para pronósticos del tiempo)
   VITE_ACCUWEATHER_API_KEY=cwAyQwpxcukFk4zVbtjUDmMI7WGpa8GE
   
   # Google Analytics (opcional, para desarrollo)
   VITE_GA_TRACKING_ID=G-2Q5EJ94KNR
   
   # Google Tag Manager (opcional, para desarrollo)
   VITE_GTM_ID=GTM-W92QTGF4
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador:**
   
   La aplicación estará disponible en: `http://localhost:5173/`

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_GEMINI_API_KEY` | Clave API de Google Gemini para IA | ✅ Sí | `MISSING_API_KEY` |
| `VITE_ACCUWEATHER_API_KEY` | Clave API de AccuWeather | ❌ No | Clave de prueba |
| `VITE_GA_TRACKING_ID` | ID de Google Analytics | ❌ No | `G-2Q5EJ94KNR` |
| `VITE_GTM_ID` | ID de Google Tag Manager | ❌ No | `GTM-W92QTGF4` |

### Configuración de Desarrollo vs Producción

La aplicación detecta automáticamente el entorno:

- **Desarrollo (`npm run dev`)**: 
  - Analytics deshabilitados
  - Ads deshabilitados
  - URLs locales
  - Servicios externos limitados

- **Producción**: 
  - Analytics habilitados
  - Ads habilitados
  - URLs de producción
  - Todos los servicios habilitados

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **IA**: Google Gemini API
- **Weather**: AccuWeather API
- **Analytics**: Google Analytics + Google Tag Manager

## 📁 Estructura del Proyecto

```
boattrip-planner/
├── components/          # Componentes React
├── src/                 # Código fuente principal
├── services/            # Servicios de API
├── data/                # Datos estáticos
├── types.ts             # Definiciones de tipos TypeScript
├── constants.ts         # Constantes de la aplicación
├── config.local.ts      # Configuración local
├── tailwind.config.js   # Configuración de Tailwind
├── postcss.config.js    # Configuración de PostCSS
└── index.css            # Estilos globales
```

## 🐛 Solución de Problemas Comunes

### Error: "Failed to load PostCSS config"
- **Causa**: Configuración incorrecta de PostCSS
- **Solución**: Verifica que `postcss.config.js` use sintaxis ES modules

### Error: "Cannot find module './index.css'"
- **Causa**: Archivo CSS no encontrado
- **Solución**: Asegúrate de que `index.css` esté en la raíz del proyecto

### Error: "Network request failed"
- **Causa**: Recursos externos no disponibles
- **Solución**: En desarrollo, los servicios externos están comentados en `index.html`

### Error: "MISSING_API_KEY"
- **Causa**: No se configuró la clave API de Gemini
- **Solución**: Agrega `VITE_GEMINI_API_KEY` en tu archivo `.env.local`

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 📝 Notas de Desarrollo

- La aplicación usa **Tailwind CSS** configurado localmente (no CDN)
- Los **service workers** están deshabilitados en desarrollo
- **Google Analytics** y **Tag Manager** están comentados en desarrollo
- Las **fuentes** tienen fallbacks locales para mejor rendimiento

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
