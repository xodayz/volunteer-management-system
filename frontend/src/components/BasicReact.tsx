import React from 'react';

export default function BasicReact() {
  console.log('🔥 BasicReact renderizando');
  
  return React.createElement('div', {
    style: {
      padding: '40px',
      backgroundColor: 'blue',
      color: 'white',
      textAlign: 'center',
      border: '5px solid yellow'
    }
  }, [
    React.createElement('h1', { key: 'h1' }, 'REACT CON createElement'),
    React.createElement('p', { key: 'p1' }, 'Sin JSX, solo createElement'),
    React.createElement('p', { key: 'p2' }, `Hora: ${new Date().toLocaleString()}`)
  ]);
}
