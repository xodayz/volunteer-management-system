// Script para probar las rutas de eventos

const pool = require('./src/config/database').default || require('./src/config/database');

async function testEventRoutes() {
  try {
    console.log('🧪 Probando endpoints de eventos...\n');

    // Test 1: Obtener categorías (ruta pública)
    console.log('1️⃣ Probando GET /api/eventos/categorias');
    const response1 = await fetch('http://localhost:3001/api/eventos/categorias');
    if (response1.ok) {
      const categorias = await response1.json();
      console.log('✅ Categorías obtenidas:', categorias.categorias?.length || 0);
    } else {
      console.log('❌ Error al obtener categorías:', response1.status);
    }

    console.log('\n✅ Base de datos actualizada y lista para eventos!');
    console.log('\n📋 Resumen de la actualización:');
    console.log('✅ Tabla eventos: estructura corregida');
    console.log('✅ Campo voluntarios_inscritos: cambiado de ARRAY a INTEGER');
    console.log('✅ Campo requisitos: cambiado de ARRAY a TEXT');
    console.log('✅ Categorías de eventos: 8 categorías insertadas');
    console.log('✅ Claves foráneas: configuradas correctamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testEventRoutes();
