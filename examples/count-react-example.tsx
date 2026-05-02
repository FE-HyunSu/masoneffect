import React, { useRef, useState } from 'react';
import Count from 'masoneffect/react/count';
import { easingFunctions } from 'masoneffect/react/count';
import type { CountRef } from 'masoneffect/react/count';

function App() {
  const count1Ref = useRef<CountRef>(null);
  const count2Ref = useRef<CountRef>(null);
  const count3Ref = useRef<CountRef>(null);
  const [currentEasing, setCurrentEasing] = useState('linear');

  const easingMap = {
    linear: easingFunctions.linear,
    easeOutQuad: easingFunctions.easeOutQuad,
    easeOutCubic: easingFunctions.easeOutCubic,
    easeInOutQuad: easingFunctions.easeInOutQuad,
  };

  const handleChangeEasing = (easingName: string) => {
    setCurrentEasing(easingName);
    if (count3Ref.current) {
      count3Ref.current.updateConfig({
        easing: easingMap[easingName as keyof typeof easingMap],
      });
      count3Ref.current.reset();
      count3Ref.current.start();
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 60, fontSize: '2.5rem' }}>
          🎯 MasonEffect Count - React
        </h1>

        {/* 기본 카운팅 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: 40,
          marginBottom: 30,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: 20, fontSize: '1.5rem' }}>기본 카운팅</h2>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '40px 0',
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 15,
            padding: 20,
          }}>
            <Count
              ref={count1Ref}
              targetValue={1000}
              duration={2000}
              startValue={0}
              easing={easingFunctions.linear}
              onUpdate={(value) => console.log('Count 1:', value)}
              onComplete={() => console.log('Count 1 completed!')}
              style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
            <button
              onClick={() => count1Ref.current?.reset()}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
            <button
              onClick={() => {
                count1Ref.current?.reset();
                count1Ref.current?.start();
              }}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Restart
            </button>
          </div>
          <div style={{
            marginTop: 20,
            padding: 15,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            fontSize: '0.9rem',
          }}>
            <strong>설정:</strong> 0부터 1000까지 2초 동안 카운팅
          </div>
        </div>

        {/* 빠른 카운팅 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: 40,
          marginBottom: 30,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: 20, fontSize: '1.5rem' }}>빠른 카운팅</h2>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '40px 0',
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 15,
            padding: 20,
          }}>
            <Count
              ref={count2Ref}
              targetValue={5000}
              duration={1000}
              startValue={0}
              easing={easingFunctions.easeOutQuad}
              style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
            />
          </div>
          <div style={{
            marginTop: 20,
            padding: 15,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            fontSize: '0.9rem',
          }}>
            <strong>설정:</strong> 0부터 5000까지 1초 동안 카운팅 (빠른 애니메이션)
          </div>
        </div>

        {/* 다양한 Easing 효과 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: 40,
          marginBottom: 30,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: 20, fontSize: '1.5rem' }}>다양한 Easing 효과</h2>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '40px 0',
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 15,
            padding: 20,
          }}>
            <Count
              ref={count3Ref}
              targetValue={1000}
              duration={2000}
              startValue={0}
              easing={easingMap[currentEasing as keyof typeof easingMap]}
              style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {Object.keys(easingMap).map((easingName) => (
              <button
                key={easingName}
                onClick={() => handleChangeEasing(easingName)}
                style={{
                  padding: '12px 24px',
                  background: currentEasing === easingName 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {easingName}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: 20,
            padding: 15,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            fontSize: '0.9rem',
          }}>
            <strong>현재 Easing:</strong> {currentEasing}
          </div>
        </div>

        {/* 스크롤 시 자동 시작 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: 40,
          marginTop: '100vh',
          marginBottom: 30,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: 20, fontSize: '1.5rem' }}>스크롤 시 자동 시작</h2>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '40px 0',
            minHeight: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 15,
            padding: 20,
          }}>
            <Count
              targetValue={999}
              duration={2500}
              startValue={0}
              easing={easingFunctions.easeOutQuad}
              threshold={0.2}
              rootMargin="0px 0px -100px 0px"
              triggerOnce={true}
              style={{ fontSize: 'inherit', fontWeight: 'inherit' }}
            />
          </div>
          <div style={{
            marginTop: 20,
            padding: 15,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            fontSize: '0.9rem',
          }}>
            <strong>설정:</strong> 화면에 보일 때 자동으로 시작 (IntersectionObserver 사용)
            <br />0부터 999까지 2.5초 동안 카운팅
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


