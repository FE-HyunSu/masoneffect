import React, { useRef, useState, useEffect, useCallback } from 'react';
import MasonEffect from 'masoneffect/react';
import type { MasonEffectRef } from 'masoneffect/react';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  getImageDataTime: number;
  memory: number;
  particles: number;
  canvasSize: string;
}

function PerformanceMonitor({ instance }: { instance: MasonEffectRef | null }) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    getImageDataTime: 0,
    memory: 0,
    particles: 0,
    canvasSize: '--',
  });
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  const updateStats = useCallback(() => {
    if (!instance) return;

    const now = performance.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const fps = Math.round(1000 / delta);
    const frameTime = delta;

    setFpsHistory((prev) => {
      const newHistory = [...prev, fps];
      return newHistory.slice(-60);
    });

    setStats((prev) => ({
      ...prev,
      fps,
      frameTime: parseFloat(frameTime.toFixed(2)),
      memory: performance.memory
        ? parseFloat((performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2))
        : 0,
      particles: (instance as any).particles?.length || 0,
      canvasSize: (instance as any).canvas
        ? `${(instance as any).canvas.width}×${(instance as any).canvas.height}`
        : '--',
    }));

    if (isMonitoring) {
      frameRef.current = requestAnimationFrame(updateStats);
    }
  }, [instance, isMonitoring]);

  useEffect(() => {
    if (isMonitoring) {
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(updateStats);
    } else {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isMonitoring, updateStats]);

  const getStatClass = (value: number, thresholds: { warning: number; error: number }) => {
    if (value > thresholds.error) return 'error';
    if (value > thresholds.warning) return 'warning';
    return '';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(26, 26, 26, 0.9)',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #3a3a3a',
      minWidth: '280px',
      zIndex: 1000,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>Performance Monitor</h3>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          style={{
            padding: '4px 12px',
            background: isMonitoring ? '#F44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          {isMonitoring ? 'Stop' : 'Start'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>FPS</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatClass(stats.fps, { warning: 50, error: 30 }) === 'error' ? '#F44336' :
                   getStatClass(stats.fps, { warning: 50, error: 30 }) === 'warning' ? '#FF9800' : '#4CAF50',
          }}>
            {stats.fps}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>Frame Time</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatClass(stats.frameTime, { warning: 20, error: 33.33 }) === 'error' ? '#F44336' :
                   getStatClass(stats.frameTime, { warning: 20, error: 33.33 }) === 'warning' ? '#FF9800' : '#4CAF50',
          }}>
            {stats.frameTime}ms
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>getImageData</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatClass(stats.getImageDataTime, { warning: 10, error: 16.67 }) === 'error' ? '#F44336' :
                   getStatClass(stats.getImageDataTime, { warning: 10, error: 16.67 }) === 'warning' ? '#FF9800' : '#4CAF50',
          }}>
            {stats.getImageDataTime}ms
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>Memory</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats.memory > 0 ? `${stats.memory}MB` : 'N/A'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>Particles</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats.particles}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>Canvas</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            {stats.canvasSize}
          </div>
        </div>
      </div>

      {fpsHistory.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '5px' }}>FPS History</div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '40px',
            gap: '2px',
          }}>
            {fpsHistory.map((fps, idx) => {
              const height = (fps / 60) * 100;
              const color = fps < 30 ? '#F44336' : fps < 50 ? '#FF9800' : '#4CAF50';
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: color,
                    minHeight: '1px',
                    height: `${height}%`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
        <PerformanceMonitor instance={effectRef.current} />
      </div>
      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleMorph}>Morph</button>
        <button onClick={handleScatter}>Scatter</button>
        <button onClick={handleChangeText}>Change Text</button>
        <button onClick={handleChangeWithOptions}>Change Text</button>
      </div>
    </div>
  );
}

export default App;

