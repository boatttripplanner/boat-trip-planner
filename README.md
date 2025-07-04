<<<<<<< HEAD
# 🛥️ BoatTrip Planner

Una app para recomendar rutas e ideas cuando alquilas un barco o si ya tienes uno, y quieres explorar cualquier destino del mundo. Incluye blog, monetización con enlaces de afiliado (Amazon y SamBoat), y experiencia profesional en móviles y web.

## 🚀 Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Markdown
- Framer Motion
- APIs: Gemini, AccuWeather, Pexels
- Blog autogestionado con imágenes dinámicas
- Monetización con Amazon y SamBoat
- Hosting en Vercel
- PWA instalable

## 📁 Estructura
- `/src/app`: rutas del sitio (home, destinos, blog)
- `/src/components`: interfaz modular (clima, galería, itinerario, enlaces, etc.)
- `/api`: rutas para Gemini, AccuWeather, Pexels
- `/content/blog`: archivos Markdown para el blog
- `/public`: íconos, favicon, logo, manifest.json para PWA

## 🌍 API Routes
- `/api/generateTrip?destino=...`: itinerario IA, clima, imágenes, afiliados
- `/api/blogImage?topic=...`: imagen de portada para blog

## 📱 PWA
- manifest.json, service worker, iconos, aviso "Agregar a pantalla de inicio", offline fallback

## 📊 SEO y rendimiento
- SEO dinámico, Open Graph, sitemap.xml, robots.txt, imágenes optimizadas, accesibilidad

## 💰 Monetización
- Amazon y SamBoat (enlaces de afiliado)

## 🧪 Variables de entorno
- `GEMINI_API_KEY`, `ACCUWEATHER_API_KEY`, `PEXELS_API_KEY`

## ✅ Resultado esperado
Proyecto funcional, modular, optimizado, editable en Markdown, desplegable en Vercel y listo para monetizar.

---

## 🚀 Instalación y desarrollo

1. Clona el repositorio y entra en la carpeta:
   ```bash
   git clone https://github.com/tuusuario/boattrip-planner.git
   cd boattrip-planner
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` con tus claves:
   ```env
   GEMINI_API_KEY=...
   ACCUWEATHER_API_KEY=...
   PEXELS_API_KEY=...
   ```
4. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## 🚢 Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Conéctalo a Vercel y añade las variables de entorno.
3. ¡Listo! La app será PWA, SEO friendly y lista para monetizar.

## 📝 Editar el blog

- Los posts están en `/content/blog` como archivos `.md` con frontmatter YAML.
- Ejemplo:
  ```md
  ---
  title: "Navegar por Croacia en 7 días"
  description: "Explora la costa dálmata con esta ruta optimizada para barcos."
  keywords: ["Croacia", "islas", "velero"]
  ---
  Contenido en Markdown...
  ```
- La imagen de portada se genera automáticamente desde Pexels según el tema.

## 🏆 Optimización y buenas prácticas

- Imágenes optimizadas con `next/image` y Pexels.
- Accesibilidad: roles, alt, contraste, semántica correcta.
- Animaciones suaves con Framer Motion.
- PWA: manifest, service worker, aviso de instalación.
- SEO: metadatos dinámicos, sitemap, robots.txt, Open Graph.
- Modularidad y escalabilidad listas para crecer.

---

¿Dudas? ¡Abre un issue o contacta al autor!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
=======
# Boat Trip Planner

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```
>>>>>>> d5fc395

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
