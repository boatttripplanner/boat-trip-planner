import fs from 'fs';
import path from 'path';

// Iconos que necesitamos generar
const iconSizes = [
  72, 96, 114, 120, 144, 150, 152, 180, 192, 310, 512
];

// Crear directorio de iconos si no existe
const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Crear iconos placeholder simples
iconSizes.forEach(size => {
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0d9488"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size/4}">🚢</text>
</svg>`;
  
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  
  // Guardar como SVG por ahora (los PNG se pueden generar después con una herramienta como sharp)
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Icono creado: icon-${size}x${size}.svg`);
});

// Crear iconos específicos para diferentes plataformas
const specificIcons = [
  { name: 'icon-310x150.png', width: 310, height: 150 },
  { name: 'icon-310x310.png', width: 310, height: 310 },
  { name: 'icon-150x150.png', width: 150, height: 150 },
  { name: 'icon-70x70.png', width: 70, height: 70 }
];

specificIcons.forEach(icon => {
  const svgContent = `<svg width="${icon.width}" height="${icon.height}" viewBox="0 0 ${icon.width} ${icon.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${icon.width}" height="${icon.height}" fill="#0d9488"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(icon.width, icon.height)/4}">🚢</text>
</svg>`;
  
  const svgPath = path.join(iconsDir, icon.name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Icono creado: ${icon.name.replace('.png', '.svg')}`);
});

console.log('\n🎉 Iconos SVG creados exitosamente!');
console.log('💡 Para convertir a PNG, puedes usar herramientas como:');
console.log('   - https://convertio.co/svg-png/');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - O instalar sharp: npm install sharp'); 