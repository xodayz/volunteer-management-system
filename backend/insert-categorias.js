// Script para insertar categorías de eventos en la base de datos

const pool = require('./src/config/database').default || require('./src/config/database');

const categorias = [
  {
    nombre: 'Medio Ambiente',
    descripcion: 'Actividades de conservación, limpieza y cuidado del medio ambiente'
  },
  {
    nombre: 'Educación',
    descripcion: 'Programas educativos, alfabetización y capacitación'
  },
  {
    nombre: 'Salud',
    descripcion: 'Campañas de salud, vacunación y asistencia médica'
  },
  {
    nombre: 'Asistencia Social',
    descripcion: 'Ayuda a comunidades vulnerables y personas en necesidad'
  },
  {
    nombre: 'Deportes y Recreación',
    descripcion: 'Actividades deportivas y recreativas para la comunidad'
  },
  {
    nombre: 'Arte y Cultura',
    descripcion: 'Eventos culturales, artísticos y de preservación patrimonial'
  },
  {
    nombre: 'Tecnología',
    descripcion: 'Capacitación tecnológica y alfabetización digital'
  },
  {
    nombre: 'Emergencias',
    descripcion: 'Respuesta a emergencias y desastres naturales'
  }
];

async function insertCategorias() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Insertando categorías de eventos...');
    
    await client.query('BEGIN');

    // Verificar si ya existen categorías
    const existingCount = await client.query('SELECT COUNT(*) FROM categorias_eventos');
    const count = parseInt(existingCount.rows[0].count);

    if (count > 0) {
      console.log(`ℹ️  Ya existen ${count} categorías en la base de datos.`);
      
      // Mostrar categorías existentes
      const existing = await client.query('SELECT * FROM categorias_eventos ORDER BY id_categoria');
      console.log('\n📋 Categorías existentes:');
      existing.rows.forEach(cat => {
        console.log(`   ${cat.id_categoria}. ${cat.nombre} - ${cat.descripcion}`);
      });
      
      await client.query('ROLLBACK');
      return;
    }

    // Insertar nuevas categorías
    for (const categoria of categorias) {
      await client.query(
        'INSERT INTO categorias_eventos (nombre, descripcion) VALUES ($1, $2)',
        [categoria.nombre, categoria.descripcion]
      );
      console.log(`✅ Insertada: ${categoria.nombre}`);
    }

    await client.query('COMMIT');
    
    console.log('\n🎉 Todas las categorías han sido insertadas exitosamente!');
    
    // Mostrar categorías insertadas
    const result = await client.query('SELECT * FROM categorias_eventos ORDER BY id_categoria');
    console.log('\n📋 Categorías disponibles:');
    result.rows.forEach(cat => {
      console.log(`   ${cat.id_categoria}. ${cat.nombre} - ${cat.descripcion}`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al insertar categorías:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

// Ejecutar script
insertCategorias();
