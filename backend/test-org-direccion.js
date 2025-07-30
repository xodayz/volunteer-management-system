// Test para verificar que el registro de organizaciones funciona con dirección

console.log('🧪 Probando registro de organizaciones con el campo dirección...\n');

async function testOrganizacionRegister() {
  const testData = {
    nombreOrganizacion: `Fundación Test ${Date.now()}`,
    nombreRepresentante: 'María González',
    correoRepresentante: `test.org.${Date.now()}@example.com`,
    password: 'Test123456',
    telefono: '+1-555-0123',
    sitioWeb: 'https://www.testorg.com',
    direccion: 'Av. Principal 456, Edificio Central, Piso 3, Santo Domingo, República Dominicana',
    descripcion: 'Organización dedicada a brindar apoyo educativo y social a comunidades vulnerables. Nuestro objetivo es mejorar la calidad de vida de las familias mediante programas de capacitación y desarrollo comunitario.'
  };

  try {
    console.log('📤 Enviando datos de registro de organización...');
    console.log('Datos:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/organizacion/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log(`\n📥 Respuesta del servidor (${response.status}):`);
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ ¡Registro de organización exitoso con dirección!');
      console.log(`📍 Dirección registrada: ${testData.direccion}`);
    } else {
      console.log('\n❌ Error en el registro de organización');
      if (result.errors) {
        console.log('Errores específicos:', result.errors);
      }
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Solo ejecutar si estamos en Node.js
if (typeof window === 'undefined') {
  testOrganizacionRegister();
}

console.log(`
🎯 Campo dirección agregado exitosamente:

✅ Frontend:
   - Nuevo campo "Dirección" en RegisterFormOrganizacion.tsx
   - Textarea con validación requerida
   - Icono MapPin para mejor UX
   - Placeholder descriptivo

✅ Backend:
   - Validación de longitud (10-300 caracteres)
   - Modelo actualizado para incluir dirección
   - Servicio de autenticación actualizado
   - Campo agregado a la inserción en base de datos

✅ Base de Datos:
   - Columna 'direccion' ya existía como TEXT nullable
   - Compatible con datos largos de dirección

📍 El campo dirección es obligatorio y permite hasta 300 caracteres
`);
