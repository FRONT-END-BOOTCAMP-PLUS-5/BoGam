'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Book from './Book';
import { disposeAllLoaders } from '@utils/useLoaders';

interface BookCanvasProps {
  bookId: number;
  onBookClick?: (bookId: number) => void;
  onLoadingComplete?: () => void;
}

export default function BookCanvas({ 
  bookId, 
  onBookClick,
  onLoadingComplete
}: BookCanvasProps) {
  // 고정된 크기 설정
  const height = 150;
  const [ , setIsBookLoaded] = useState(false);

  // 컴포넌트 언마운트 시 모든 로더 정리
  useEffect(() => {
    return () => {
      disposeAllLoaders();
    };
  }, []);

  // 책 로딩 완료 시 콜백 호출
  const handleBookLoad = () => {
    setIsBookLoaded(true);
    if (onLoadingComplete) {
      onLoadingComplete();
    }
  };

  return (
    <div className="w-full">
      <div 
        className="relative w-full"
        style={{ height: `${height}px` }}
      >
        <Canvas
          camera={{
            fov: 30,
            position: [0, 0, 5],
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            alpha: true,              // 알파 채널 활성화 (투명 배경)
            powerPreference: "default",
            preserveDrawingBuffer: false,
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false
          }}
          style={{ background: 'transparent' }}  // CSS 스타일로도 투명 설정
          resize={{ scroll: false }}  // 스크롤 시 리사이즈 방지
        >
          <Suspense fallback={null}>
            {/* 기본 조명 */}
            <ambientLight intensity={0.6} />
            
            {/* 메인 조명 - 위에서 */}
            <directionalLight 
              position={[0, 8, 5]} 
              intensity={1.2} 
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            
            {/* 보조 조명 - 아래에서 */}
            <directionalLight 
              position={[0, -8, 5]} 
              intensity={0.6} 
              castShadow 
            />
            
            {/* 측면 조명 - 왼쪽 */}
            <directionalLight 
              position={[-8, 0, 5]} 
              intensity={0.8} 
              castShadow 
            />
            
            {/* 측면 조명 - 오른쪽 */}
            <directionalLight 
              position={[8, 0, 5]} 
              intensity={0.8} 
              castShadow 
            />
            
            {/* 전면 조명 - 카메라 방향 */}
            <directionalLight 
              position={[0, 0, 8]} 
              intensity={0.4} 
              castShadow 
            />
            
            {/* 포인트 조명 - 책 주변 */}
            <pointLight 
              position={[0, 2, 3]} 
              intensity={0.5} 
              distance={10}
              decay={2}
            />
            
            {/* 책 렌더링 */}
            <Book
              bookId={bookId}
              onBookClick={onBookClick}
              onLoad={handleBookLoad}
            />
            
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
