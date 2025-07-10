import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  72, 96, 114, 120, 128, 144, 152, 180, 192, 384, 512
];

const specialSizes = [
  { width: 310, height: 150, name: 'icon-310x150.png' },
  { width: 310, height: 310, name: 'icon-310x310.png' },
  { width: 150, height: 150, name: 'icon-150x150.png' },
  { width: 70, height: 70, name: 'icon-70x70.png' }
];

async function generateIcons() {
  const iconDir = path.join(__dirname, '../public/icons');
  
  // Asegurar que el directorio existe
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  const svgPath = path.join(iconDir, 'icon-base.svg');
  
  if (!fs.existsSync(svgPath)) {
    console.error('No se encontró el archivo icon-base.svg');
    return;
  }

  console.log('Generando iconos...');

  // Generar iconos cuadrados
  for (const size of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
      
      console.log(`✓ Generado icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Error generando icon-${size}x${size}.png:`, error.message);
    }
  }

  // Generar iconos especiales
  for (const { width, height, name } of specialSizes) {
    try {
      await sharp(svgPath)
        .resize(width, height)
        .png()
        .toFile(path.join(iconDir, name));
      
      console.log(`✓ Generado ${name}`);
    } catch (error) {
      console.error(`✗ Error generando ${name}:`, error.message);
    }
  }

  console.log('¡Iconos generados exitosamente!');
}

generateIcons().catch(console.error); 