// Script para probar autenticación de organizaciones

const fetch = require('node-fetch');

async function testOrganizacionAuth() {
  const baseUrl = 'http://localhost:3001/api/organizacion';
  
  console.log('🧪 Probando sistema de autenticación de organizaciones...\n');

  try {
    // 1. Intentar registrar una organización de prueba
    console.log('1️⃣ Registrando organización de prueba...');
    
    const registerData = {
      nombreOrganizacion: 'Organización Test',
      nombreRepresentante: 'Juan Pérez',
      correoRepresentante: 'test@organizacion.com',
      password: '123456',
      telefono: '809-555-0123',
      descripcion: 'Organización para pruebas del sistema',
      direccion: 'Calle Principal #123, Santo Domingo'
    };

    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const registerResult = await registerResponse.json();
    
    if (registerResult.success) {
      console.log('✅ Organización registrada exitosamente');
    } else {
      console.log('ℹ️ Organización ya existe o error:', registerResult.message);
    }

    // 2. Intentar hacer login
    console.log('\n2️⃣ Probando login...');
    
    const loginData = {
      email: 'test@organizacion.com',
      password: '123456'
    };

    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ Login exitoso');
      console.log('🔑 Token recibido:', loginResult.token ? 'Sí' : 'No');
      console.log('👤 Datos de organización:', loginResult.data?.organizacion?.nombre_organizacion || 'No encontrados');
      
      // 3. Probar acceso a ruta protegida (si existe)
      console.log('\n3️⃣ Probando acceso con token...');
      
      const protectedResponse = await fetch(`${baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResult.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (protectedResponse.ok) {
        const profileData = await protectedResponse.json();
        console.log('✅ Acceso autorizado a perfil');
      } else {
        console.log('ℹ️ Ruta de perfil no disponible o no protegida');
      }
      
    } else {
      console.log('❌ Error en login:', loginResult.message);
    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testOrganizacionAuth();
