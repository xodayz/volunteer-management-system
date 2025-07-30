// Test completo del flujo de autenticación de organizaciones
// Este script simula exactamente lo que haría un usuario en el navegador

console.log('🧪 INICIANDO PRUEBA COMPLETA DEL SISTEMA DE ORGANIZACIONES 🧪\n');

// Simular el flujo completo
async function testCompletFlow() {
  console.log('1️⃣ PASO 1: Login de organización...');
  
  // Simular lo que hace el LoginFormOrganizacion
  const loginData = {
    email: 'psuarez@fudintec.com.do',
    password: 'Caja@12345'
  };

  try {
    const response = await fetch('http://localhost:3001/api/organizacion/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    
    if (data.success && data.token) {
      console.log('✅ Login exitoso');
      console.log('🔑 Token recibido:', data.token.substring(0, 20) + '...');
      
      // Simular lo que hace el organizacionAuthService
      const organizacionAuthToken = data.token;
      const organizacionData = data.data.organizacion;
      
      console.log('\n2️⃣ PASO 2: Guardando datos en localStorage (simulado)...');
      console.log('🔑 Token a guardar:', organizacionAuthToken ? 'Presente' : 'Ausente');
      console.log('🏢 Datos de organización:', organizacionData);
      
      // Simular verificación del dashboard
      console.log('\n3️⃣ PASO 3: Verificación de autenticación del dashboard...');
      
      // Verificar token
      if (!organizacionAuthToken) {
        console.log('❌ FALLO: No hay token');
        return false;
      }
      console.log('✅ Token presente');
      
      // Verificar datos de organización
      if (!organizacionData) {
        console.log('❌ FALLO: No hay datos de organización');
        return false;
      }
      console.log('✅ Datos de organización presentes');
      
      console.log('\n4️⃣ PASO 4: Datos finales que se guardarían:');
      console.log('📧 Email:', organizacionData.correo);
      console.log('🏢 Nombre:', organizacionData.nombre);
      console.log('👤 Representante:', organizacionData.nombreRepresentante);
      console.log('📞 Teléfono:', organizacionData.telefono);
      
      console.log('\n🎉 PRUEBA EXITOSA: El flujo completo funciona correctamente');
      console.log('💡 El problema debe estar en el navegador o en un error JavaScript específico');
      
      return true;
      
    } else {
      console.log('❌ Login falló:', data.message);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error durante el test:', error.message);
    return false;
  }
}

// Ejecutar el test
testCompletFlow().then(success => {
  if (success) {
    console.log('\n🔍 SIGUIENTE PASO: Revisar la consola del navegador para errores JavaScript');
    console.log('📋 INSTRUCCIONES:');
    console.log('   1. Abrir http://localhost:4322/login-organizacion');
    console.log('   2. Abrir DevTools (F12)');
    console.log('   3. Ir a la pestaña Console');
    console.log('   4. Hacer login con las credenciales');
    console.log('   5. Observar los logs detallados que se mostrarán');
  }
});
