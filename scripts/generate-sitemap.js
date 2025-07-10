import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { allBlogPosts } from '../src/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.boattrip-planner.com';

function generateSitemap() {
  const currentDate = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Página principal -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Página del blog -->
  <url>
    <loc>${BASE_URL}/?view=blog_index</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Agregar posts del blog
  allBlogPosts.forEach(post => {
    const postUrl = `${BASE_URL}/?view=blog_post&slug=${post.frontmatter.slug}`;
    const lastmod = post.frontmatter.date || currentDate;
    
    sitemap += `
  <!-- Post del blog: ${post.frontmatter.title} -->
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
    
    // Agregar imagen destacada si existe
    if (post.frontmatter.featuredImage) {
      sitemap += `
    <image:image>
      <image:loc>${BASE_URL}${post.frontmatter.featuredImage}</image:loc>
      <image:title>${post.frontmatter.title}</image:title>
      <image:caption>${post.frontmatter.summary}</image:caption>
    </image:image>`;
    }
    
    sitemap += `
  </url>`;
  });

  sitemap += `
</urlset>`;

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap generado exitosamente en public/sitemap.xml');
}

generateSitemap(); 