'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { OrbitControls, Environment, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';
import Book from './Book';
import Bookshelf from './Bookshelf';

interface Scene3DProps {
  className?: string;
}

// HDR 환경맵을 로드하는 컴포넌트
function HDREnvironment({ onEnvironmentLoaded }: { onEnvironmentLoaded: () => void }) {
  const envMap = useEnvironment({ files: '/models/hdr/lilienstein_4k.hdr' });
  
  // 환경맵이 로딩되면 콜백 호출
  useEffect(() => {
    if (envMap) {
      console.log('🌍 HDR 환경맵 로딩 완료');
      onEnvironmentLoaded();
    }
  }, [envMap, onEnvironmentLoaded]);
  
  return (
    <Environment 
      map={envMap} 
      background={true}
      resolution={4096}
      blur={0.1}
    />
  );
}

export default function Scene3D({ className }: Scene3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9); // 기본값 설정

  // 클라이언트 사이드에서 화면 비율 계산
  useEffect(() => {
    const updateAspectRatio = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };

    // 초기 설정
    updateAspectRatio();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateAspectRatio);

    // 클린업
    return () => {
      window.removeEventListener('resize', updateAspectRatio);
    };
  }, []);

  // Canvas 초기 설정 완료 후 로딩 상태 관리
  useEffect(() => {
    // 약간의 지연을 두어 Canvas 초기화 완료 확인
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('🎉 전체 씬 로딩 완료');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 환경맵 로딩 완료 콜백을 메모이제이션
  const handleEnvironmentLoaded = useCallback(() => {
    // 환경맵 로딩이 완료된 후 1ms 지연 후 책 렌더링 시작
    setTimeout(() => {
      setIsLoading(false);
      console.log('🎉 책 렌더링 시작');
    }, 1);
  }, []);

  const handleBookClick = (bookId: number) => {
    console.log(`📚 ${bookId}단계 클릭됨!`);
    
    // 책 상태 토글
    if (openBookId === bookId) {
      console.log(`📚 ${bookId}단계 닫기`);
      setOpenBookId(null); // 닫기
    } else {
      console.log(`📚 ${bookId}단계 열기`);
      setOpenBookId(bookId); // 열기
    }
    
    // 필요시 페이지 이동 로직 추가
    // window.location.href = `/step${bookId}`;
  };

  const handleBookClose = (bookId: number) => {
    console.log(`📚 ${bookId}단계 닫힘!`);
    setOpenBookId(null); // 열린 책 ID 초기화
  };

  return (
    <div 
      className={className || "w-full h-screen"}
      style={{ position: 'relative' }}
    >
      <Canvas
        camera={{
          fov: 75,
          aspect: aspectRatio, // 동적으로 계산된 화면 비율 사용
          near: 0.1,
          far: 1000,
          position: [0, 7.5, 4]
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        raycaster={{
          firstHitOnly: true
        }}
        shadows
        onCreated={({ gl, scene, camera }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          // gl.setSize는 제거 - R3F가 자동으로 처리
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          // HDR 환경맵을 위한 설정
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          
          // 배경색 제거 (HDR 환경맵이 배경이 됨)
          scene.background = null;
          camera.lookAt(0, 7.5, -10);
          camera.updateProjectionMatrix();
          
          console.log('🎬 Canvas 초기 설정 완료');
        }}
      >
        <Suspense fallback={null}>
          {/* OrbitControls - 마우스로 화면 이동 및 회전 */}
          <OrbitControls 
            enablePan={true}           // 마우스 우클릭 드래그로 이동
            enableZoom={true}          // 마우스 휠로 줌
            enableRotate={true}        // 마우스 좌클릭 드래그로 회전
            minDistance={2}            // 최소 줌 거리
            maxDistance={50}           // 최대 줌 거리
            minPolarAngle={0}          // 최소 수직 각도 (0도)
            maxPolarAngle={Math.PI}    // 최대 수직 각도 (180도)
            target={[0, 7.5, -10]}    // 회전 중심점
            dampingFactor={0.05}       // 관성 감쇠
            enableDamping={true}       // 관성 활성화
          />
          
          {/* 조명 - HDR 환경맵과 함께 사용 */}
          {/* 환경광 - HDR 환경맵에서 제공하는 간접 조명 보강 */}
          <ambientLight intensity={0.3} />
          
          {/* 주 방향광 - 그림자와 주요 조명 */}
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0001}
            shadow-normalBias={0.02}
          />
          
          {/* 보조 방향광 - 반대편에서 부드러운 조명 */}
          <directionalLight 
            position={[-8, 15, -8]} 
            intensity={0.3} 
            color={0xffffff}
          />
          
          {/* 중앙 상단 포인트 조명 - 책꽂이 중앙 조명 */}
          <pointLight 
            position={[0, 15, 0]} 
            intensity={0.5} 
            distance={20}
            decay={2}
          />
          
          {/* 왼쪽 포인트 조명 - 윗층 책들 조명 */}
          <pointLight 
            position={[-2, 12, -3]} 
            intensity={0.4} 
            distance={15}
            decay={2}
            color={0xfff8e1}
          />
          
          {/* 오른쪽 포인트 조명 - 아래층 책들 조명 */}
          <pointLight 
            position={[2, 8, -3]} 
            intensity={0.4} 
            distance={15}
            decay={2}
            color={0xe3f2fd}
          />
          
          {/* 후면 스포트라이트 - 책꽂이 배경 조명 */}
          <spotLight
            position={[0, 12, -8]}
            target-position={[0, 7.5, -5]}
            angle={0.3}
            penumbra={0.5}
            intensity={0.3}
            distance={25}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* 책꽂이 */}
          <Bookshelf />

          {/* 책들 */}
          {[
            // 윗층 (3개)
            { bookId: 1, position: [-1.5, 10.4, -5] },
            { bookId: 2, position: [0, 10.4, -5] },
            { bookId: 3, position: [1.5, 10.4, -5] },
            // 아래층 (4개)
            { bookId: 4, position: [-2, 5.8, -5] },
            { bookId: 5, position: [-0.5, 5.8, -5] },
            { bookId: 6, position: [1, 5.8, -5] },
            { bookId: 7, position: [2.5, 5.8, -5] }
          ].map((book) => (
            <Book 
              key={book.bookId}
              position={book.position as [number, number, number]} 
              bookId={book.bookId} 
              onBookClick={handleBookClick}
              onBookClose={handleBookClose}
              isAnyBookOpen={openBookId !== null}
              isEnvironmentLoaded={!isLoading}
            />
          ))}
        </Suspense>
        
        {/* HDR 환경맵을 Suspense 밖으로 이동 - Suspense 블로킹 방지 */}
        <HDREnvironment onEnvironmentLoaded={handleEnvironmentLoaded} />
      </Canvas>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">환경맵 로딩 중...</div>
          </div>
        </div>
      )}
    </div>
  );
}
