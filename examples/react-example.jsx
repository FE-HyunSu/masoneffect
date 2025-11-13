import React, { useRef } from 'react';
import MasonEffect from 'masoneffect/react';

function App() {
  const effectRef = useRef(null);

  const handleMorph = () => {
    effectRef.current?.morph();
  };

  const handleScatter = () => {
    effectRef.current?.scatter();
  };

  const handleChangeText = () => {
    const texts = ['Hello', 'World', 'Mason', 'Effect'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    effectRef.current?.morph(randomText);
  };

  const handleChangeWithOptions = () => {
    // 텍스트와 함께 다른 속성도 변경
    effectRef.current?.morph({
      text: 'New Text',
      particleColor: '#ff00ff',
      maxParticles: 3000,
      pointSize: 1.0,
    });
  };

  return (
    <div style={{ width: '100%', height: '70vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative' }}>
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
        <button onClick={handleChangeText}>텍스트 변경</button>
        <button onClick={handleChangeWithOptions}>텍스트+속성 변경</button>
      </div>
    </div>
  );
}

export default App;

