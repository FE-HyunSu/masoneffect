import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';
import type { MasonEffectRef } from 'masoneffect/react';

function App() {
  const effectRef = useRef<MasonEffectRef>(null);

  const handleMorph = () => {
    // Change text
    effectRef.current?.morph({ text: 'Morphed!' });
  };

  const handleScatter = () => {
    // Return particles to initial position
    effectRef.current?.scatter();
  };

  const handleChangeText = () => {
    const texts = ['Hello', 'World', 'Mason', 'Effect', 'Particles'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    effectRef.current?.morph({ text: randomText });
  };

  const handleChangeWithOptions = () => {
    // Change text along with other properties
    effectRef.current?.morph({
      text: 'New Text',
      particleColor: '#ff00ff',
      maxParticles: 3000,
      pointSize: 1.0,
    });
  };

  return (
    <div style={{ width: '100%', height: '70vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 400 }}>
        <MasonEffect
          ref={effectRef}
          text="Hello React"
          particleColor="#00ff88"
          maxParticles={2000}
          onReady={(instance) => {
            console.log('Ready!', instance);
          }}
        />
      </div>
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleMorph}>Morph</button>
        <button onClick={handleScatter}>Scatter</button>
        <button onClick={handleChangeText}>Change Text</button>
        <button onClick={handleChangeWithOptions}>Change Text + Options</button>
      </div>
    </div>
  );
}

export default App;

