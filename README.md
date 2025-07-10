# 🚤 BoatTrip Planner

**Planificador de viajes en barco con IA** - Una aplicación web moderna que proporciona recomendaciones personalizadas para alquiler de barcos, itinerarios náuticos y planificación de viajes marítimos utilizando inteligencia artificial.

## ✨ Características

- 🤖 **IA Integrada**: Recomendaciones personalizadas usando Google Gemini API
- 📱 **PWA Ready**: Instalable en móviles y tablets
- 🎨 **Diseño Moderno**: Interfaz elegante con Tailwind CSS
- 📊 **SEO Optimizado**: Meta tags, sitemap dinámico y estructura semántica
- 🔄 **Formulario Inteligente**: Wizard de 6 pasos con validación
- 💬 **Chat Interactivo**: Refina recomendaciones en tiempo real
- 🌤️ **Meteorología**: Integración con AccuWeather API
- 📍 **Autocompletado**: Puertos y modelos de barcos con búsqueda inteligente
- 🖨️ **Impresión**: Funcionalidad de imprimir planes de viaje
- 📱 **Responsive**: Optimizado para todos los dispositivos

## 🚀 Deployment

### GitHub Pages (Automático)
La aplicación se despliega automáticamente en GitHub Pages cada vez que se hace push a la rama `main`.

- **URL de Producción**: https://boattrip-planner.com
- **URL de GitHub Pages**: https://boatttripplanner.github.io/boat-_trip-_planner/

### Configuración de GitHub Actions
El proyecto incluye workflows automáticos:

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Verificación de tipos TypeScript
   - Build de producción
   - Linting (cuando esté configurado)

2. **Deployment Automático** (`.github/workflows/deploy.yml`)
   - Build automático en push a `main`
   - Deployment a GitHub Pages
   - Configuración de dominio personalizado

## 🛠️ Configuración Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/boatttripplanner/boat-_trip-_planner.git
cd boat-_trip-_planner

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno
Crea un archivo `.env.local` con:

```env
# Google Gemini API (requerido para IA)
VITE_GEMINI_API_KEY=tu_api_key_aqui

# AccuWeather API (opcional para meteorología)
VITE_ACCUWEATHER_API_KEY=tu_api_key_aqui

# Google Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📁 Estructura del Proyecto

```
boattrip-planner/
├── .github/workflows/     # GitHub Actions
├── components/            # Componentes React
│   ├── wizard/           # Pasos del formulario
│   └── icons/            # Iconos SVG
├── data/                 # Datos estáticos
├── services/             # Servicios de API
├── src/                  # Código fuente adicional
├── public/               # Archivos públicos
└── types.ts              # Definiciones TypeScript
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build
- `npm run type-check` - Verificar tipos TypeScript

## 🌐 Tecnologías

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **IA**: Google Gemini API
- **Meteorología**: AccuWeather API
- **Deployment**: GitHub Pages + Actions
- **PWA**: Service Worker + Manifest

## 📱 PWA Features

- ✅ Instalable en móviles
- ✅ Funcionamiento offline
- ✅ Notificaciones push (preparado)
- ✅ Actualizaciones automáticas
- ✅ Iconos adaptativos

## 🔍 SEO Features

- ✅ Meta tags optimizados
- ✅ Sitemap dinámico
- ✅ Robots.txt configurado
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Dublin Core metadata
- ✅ Estructura semántica

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/boatttripplanner/boat-_trip-_planner/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/boatttripplanner/boat-_trip-_planner/wiki)

## 🚀 Roadmap

- [ ] Tests unitarios y de integración
- [ ] Más destinos náuticos
- [ ] Integración con APIs de reservas
- [ ] Modo offline completo
- [ ] Notificaciones push
- [ ] App nativa (React Native)

---

**Desarrollado con ❤️ para la comunidad náutica**
