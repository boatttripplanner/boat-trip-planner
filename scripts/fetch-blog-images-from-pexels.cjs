// Script para añadir imágenes de Pexels a las entradas del blog
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const BLOG_DATA_PATH = path.join(__dirname, '../src/blogData.ts');
const PEXELS_API_KEY = 'kSiWzssyYIwlwxUHW9MWn0GwenaAkN2lhx7jH1TbJn70mbjTiEL9SzcS';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search?per_page=1';

async function fetchPexelsImage(query) {
  const res = await fetch(`${PEXELS_API_URL}&query=${encodeURIComponent(query)}`, {
    headers: { Authorization: PEXELS_API_KEY }
  });
  const data = await res.json();
  if (data.photos && data.photos.length > 0) {
    return data.photos[0].src.landscape || data.photos[0].src.medium;
  } else {
    console.log(`Respuesta de Pexels para '${query}':`, JSON.stringify(data, null, 2));
  }
  // Si no encuentra, probar con un término genérico 1
  if (query !== 'velero costa española') {
    const fallbackRes = await fetch(`${PEXELS_API_URL}&query=velero%20costa%20española`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const fallbackData = await fallbackRes.json();
    if (fallbackData.photos && fallbackData.photos.length > 0) {
      return fallbackData.photos[0].src.landscape || fallbackData.photos[0].src.medium;
    }
  }
  // Si tampoco, probar con un término aún más genérico en español
  if (query !== 'barco') {
    const fallbackRes2 = await fetch(`${PEXELS_API_URL}&query=barco`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const fallbackData2 = await fallbackRes2.json();
    if (fallbackData2.photos && fallbackData2.photos.length > 0) {
      return fallbackData2.photos[0].src.landscape || fallbackData2.photos[0].src.medium;
    }
  }
  // Si tampoco, probar con 'sailboat'
  if (query !== 'sailboat') {
    const fallbackRes3 = await fetch(`${PEXELS_API_URL}&query=sailboat`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const fallbackData3 = await fallbackRes3.json();
    if (fallbackData3.photos && fallbackData3.photos.length > 0) {
      return fallbackData3.photos[0].src.landscape || fallbackData3.photos[0].src.medium;
    }
  }
  // Si tampoco, probar con 'boat'
  if (query !== 'boat') {
    const fallbackRes4 = await fetch(`${PEXELS_API_URL}&query=boat`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const fallbackData4 = await fallbackRes4.json();
    if (fallbackData4.photos && fallbackData4.photos.length > 0) {
      return fallbackData4.photos[0].src.landscape || fallbackData4.photos[0].src.medium;
    }
  }
  return null;
}

async function main() {
  let content;
  try {
    content = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
  } catch (err) {
    console.error('Error leyendo el archivo de posts:', err);
    process.exit(1);
  }
  const postRegex = /frontmatter:\s*{([\s\S]*?)}\s*,/g;
  let match;
  const updates = [];
  let foundAny = false;

  while ((match = postRegex.exec(content)) !== null) {
    foundAny = true;
    const frontmatterBlock = match[1];
    const titleMatch = frontmatterBlock.match(/title:\s*['"]([^'"]+)['"]/);
    if (!titleMatch) continue;
    const title = titleMatch[1];
    let imageUrl = null;
    try {
      imageUrl = await fetchPexelsImage(title);
    } catch (err) {
      console.error(`Error buscando imagen para "${title}":`, err);
      continue;
    }
    if (imageUrl) {
      // Si ya existe featuredImage, reemplazarla
      if (/featuredImage\s*:/i.test(frontmatterBlock)) {
        // Reemplazar la línea de featuredImage
        const fmStart = match.index;
        const fmEnd = fmStart + match[0].length;
        const fmBlock = content.slice(fmStart, fmEnd);
        const newFmBlock = fmBlock.replace(/featuredImage\s*:\s*['\"][^'\"]*['\"],?/, `featuredImage: '${imageUrl}',`);
        updates.push({ fmStart, fmEnd, newFmBlock });
        console.log(`Imagen sobrescrita para "${title}": ${imageUrl}`);
      } else {
        // Insertar nueva propiedad
        const insertPos = match.index + match[0].indexOf('title');
        updates.push({ insertPos, imageUrl });
        console.log(`Imagen añadida para "${title}": ${imageUrl}`);
      }
    } else {
      console.log(`No se encontró imagen para "${title}"`);
    }
  }

  if (!foundAny) {
    console.log('No se encontró ningún post en el archivo.');
    return;
  }

  // Aplicar reemplazos de bloques primero
  for (let i = updates.length - 1; i >= 0; i--) {
    const u = updates[i];
    if (u.newFmBlock) {
      content = content.slice(0, u.fmStart) + u.newFmBlock + content.slice(u.fmEnd);
    } else {
      content = content.slice(0, u.insertPos) + `featuredImage: '${u.imageUrl}',\n      ` + content.slice(u.insertPos);
    }
  }

  try {
    fs.writeFileSync(BLOG_DATA_PATH, content, 'utf8');
    if (updates.length > 0) {
      console.log('Actualización completada. Se modificaron', updates.length, 'entradas.');
    } else {
      console.log('No se realizaron cambios en las imágenes de los posts.');
    }
  } catch (err) {
    console.error('Error escribiendo el archivo de posts:', err);
    process.exit(1);
  }
}

main(); 