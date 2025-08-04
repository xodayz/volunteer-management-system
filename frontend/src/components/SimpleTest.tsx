export default function SimpleTest() {
  console.log('🚀 SimpleTest componente se está renderizando');
  
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#ff0000', 
      color: '#ffffff',
      fontSize: '24px',
      textAlign: 'center',
      border: '5px solid #000000'
    }}>
      <h1>¡REACT FUNCIONA!</h1>
      <p>Este es un componente React funcionando</p>
      <p>Fecha: {new Date().toLocaleString()}</p>
      <button 
        onClick={() => alert('¡El botón funciona!')}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#00ff00',
          color: '#000000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Haz clic aquí
      </button>
    </div>
  );
}
