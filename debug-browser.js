// Script de debugging para ejecutar en la consola del navegador
// Copia y pega este código en la consola del navegador para diagnosticar el problema

console.log('🔍 INICIANDO DIAGNÓSTICO DE AUTENTICACIÓN DE ORGANIZACIONES');

// Función para limpiar todo el localStorage
function limpiarTodo() {
  localStorage.clear();
  console.log('🧹 localStorage limpiado');
}

// Función para verificar estado actual
function verificarEstado() {
  console.log('📊 Estado actual del localStorage:');
  console.log('  organizacionAuthToken:', localStorage.getItem('organizacionAuthToken') ? 'PRESENTE' : 'AUSENTE');
  console.log('  organizacion:', localStorage.getItem('organizacion') ? 'PRESENTE' : 'AUSENTE');
  console.log('  token:', localStorage.getItem('token') ? 'PRESENTE' : 'AUSENTE');
  
  const orgData = localStorage.getItem('organizacion');
  if (orgData) {
    try {
      const parsed = JSON.parse(orgData);
      console.log('  📋 Datos de organización:', parsed);
    } catch (e) {
      console.log('  ⚠️ Error al parsear datos de organización:', e.message);
    }
  }
}

// Función para simular login
async function simularLogin() {
  console.log('🔐 Simulando login...');
  
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
      
      // Guardar como lo hace el servicio real
      localStorage.setItem('organizacionAuthToken', data.token);
      
      if (data.data && data.data.organizacion) {
        localStorage.setItem('organizacion', JSON.stringify(data.data.organizacion));
        console.log('✅ Datos guardados correctamente');
      } else {
        console.log('⚠️ No se encontraron datos de organización en la respuesta');
      }
      
      verificarEstado();
      
      // Intentar ir al dashboard
      console.log('🏃‍♂️ Redirigiendo al dashboard...');
      window.location.href = '/dashboard-organizacion';
      
    } else {
      console.log('❌ Login falló:', data.message);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Función para verificar autenticación (como en el dashboard)
function verificarAuth() {
  console.log('🔒 Verificando autenticación...');
  
  const token = localStorage.getItem('organizacionAuthToken');
  console.log('🔑 Token:', token ? 'PRESENTE' : 'AUSENTE');
  
  if (!token) {
    console.log('❌ No hay token - redirecting to login');
    return false;
  }
  
  const organizacion = localStorage.getItem('organizacion');
  console.log('🏢 Organización:', organizacion ? 'PRESENTE' : 'AUSENTE');
  
  if (!organizacion) {
    console.log('❌ No hay datos de organización - redirecting to login');
    return false;
  }
  
  console.log('✅ Autenticación OK');
  return true;
}

// Exponer funciones globalmente para fácil acceso
window.debugAuth = {
  limpiarTodo,
  verificarEstado,
  simularLogin,
  verificarAuth
};

console.log('📋 FUNCIONES DISPONIBLES:');
console.log('  debugAuth.limpiarTodo() - Limpia todo el localStorage');
console.log('  debugAuth.verificarEstado() - Muestra el estado actual');
console.log('  debugAuth.simularLogin() - Hace login automático');
console.log('  debugAuth.verificarAuth() - Verifica autenticación');
console.log('');
console.log('💡 INSTRUCCIONES:');
console.log('1. Ejecuta debugAuth.limpiarTodo()');
console.log('2. Ejecuta debugAuth.simularLogin()');
console.log('3. Observa si te redirige al dashboard o muestra errores');
