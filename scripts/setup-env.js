#!/usr/bin/env node

/**
 * Script para configurar variables de entorno de forma segura
 * Uso: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚤 Configuración de Variables de Entorno - BoatTrip Planner\n');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  // Verificar si ya existe .env.local
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  El archivo .env.local ya existe. ¿Quieres sobrescribirlo? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Configuración cancelada.');
      rl.close();
      return;
    }
  }
  
  console.log('📝 Configurando variables de entorno...\n');
  
  // Leer archivo de ejemplo
  let envExample = '';
  if (fs.existsSync(envExamplePath)) {
    envExample = fs.readFileSync(envExamplePath, 'utf8');
  }
  
  const envVars = {};
  
  // Gemini API Key
  console.log('🤖 Google Gemini API (Requerido para IA)');
  console.log('   Obtén tu clave en: https://makersuite.google.com/app/apikey');
  envVars.VITE_GEMINI_API_KEY = await question('   VITE_GEMINI_API_KEY: ') || '';
  
  // AccuWeather API Key
  console.log('\n🌤️  AccuWeather API (Opcional para meteorología)');
  console.log('   Obtén tu clave en: https://developer.accuweather.com/');
  envVars.VITE_ACCUWEATHER_API_KEY = await question('   VITE_ACCUWEATHER_API_KEY: ') || '';
  
  // Google Analytics
  console.log('\n📊 Google Analytics (Opcional)');
  console.log('   Formato: G-XXXXXXXXXX');
  envVars.VITE_GA_MEASUREMENT_ID = await question('   VITE_GA_MEASUREMENT_ID: ') || '';
  
  // Google Tag Manager
  console.log('\n🏷️  Google Tag Manager (Opcional)');
  console.log('   Formato: GTM-XXXXXXX');
  envVars.VITE_GTM_ID = await question('   VITE_GTM_ID: ') || '';
  
  // Base URL
  console.log('\n🌐 URL Base');
  envVars.VITE_BASE_URL = await question('   VITE_BASE_URL (default: http://localhost:5173): ') || 'http://localhost:5173';
  
  // Generar contenido del archivo .env.local
  let envContent = '# BoatTrip Planner - Variables de Entorno\n';
  envContent += '# Generado automáticamente por setup-env.js\n\n';
  
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      envContent += `${key}=${value}\n`;
    } else {
      envContent += `# ${key}=your_value_here\n`;
    }
  });
  
  envContent += '\n# Configuración de desarrollo\n';
  envContent += 'NODE_ENV=development\n';
  envContent += 'VITE_DEV_MODE=true\n';
  
  // Escribir archivo
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Archivo .env.local creado exitosamente!');
    console.log(`📁 Ubicación: ${envPath}`);
    
    // Mostrar resumen
    console.log('\n📋 Resumen de configuración:');
    console.log(`   🤖 Gemini API: ${envVars.VITE_GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   🌤️  AccuWeather: ${envVars.VITE_ACCUWEATHER_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   📊 Analytics: ${envVars.VITE_GA_MEASUREMENT_ID ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   🏷️  GTM: ${envVars.VITE_GTM_ID ? '✅ Configurado' : '❌ No configurado'}`);
    
    if (!envVars.VITE_GEMINI_API_KEY) {
      console.log('\n⚠️  IMPORTANTE: Sin la clave de Gemini API, la funcionalidad de IA no estará disponible.');
      console.log('   Para obtener una clave: https://makersuite.google.com/app/apikey');
    }
    
    console.log('\n🚀 Para iniciar el servidor de desarrollo: npm run dev');
    
  } catch (error) {
    console.error('❌ Error al crear el archivo .env.local:', error.message);
  }
  
  rl.close();
}

// Ejecutar script
setupEnvironment().catch(console.error); 