'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBook, BOOK_MODEL_CREDIT } from './components/Book';

export default function BigStepPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const animationTypeRef = useRef<'open' | 'close' | null>(null);
  const bookMixerRef = useRef<THREE.AnimationMixer | undefined>(undefined);
  const animationActionRef = useRef<THREE.AnimationAction | undefined>(undefined);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // 연한 회색 배경

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      60, // FOV를 60으로 설정하여 자연스러운 시야각
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 15); // 카메라를 적절한 거리에 배치

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 부드러운 그림자
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 톤매핑 설정
    renderer.toneMappingExposure = 1.2; // 노출 증가
    renderer.outputColorSpace = THREE.SRGBColorSpace; // 색상 공간 설정
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5; // 최소 거리 설정
    controls.maxDistance = 30; // 최대 거리 설정

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 환경 조명 강도 줄임
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // 방향성 조명
    directionalLight.position.set(10, 20, 10); // 위치 조정
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096; // 그림자 맵 크기 증가
    directionalLight.shadow.mapSize.height = 4096; // 그림자 맵 크기 증가
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0001; // 그림자 bias 조정
    directionalLight.shadow.normalBias = 0.02; // normal bias 추가
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5); // 포인트 조명 강도 줄임
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    // 바닥 생성
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // 책 생성 및 추가
    const loadBook = async () => {
      try {
        const { group: book, mixer } = await createBook({
          position: new THREE.Vector3(0, 1, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(0.5, 0.5, 0.5) // 스케일을 0.5로 줄임
        });
        scene.add(book);
        bookMixerRef.current = mixer;
        
        // 애니메이션 액션 설정
        if (mixer) {
          const actions = (mixer as any)._actions || [];
          if (actions.length > 0) {
            animationActionRef.current = actions[0];
          }
        }
      } catch (error) {
        console.error('Error loading book:', error);
      }
    };

    loadBook();

    // 애니메이션 함수
    const clock = new THREE.Clock();
    const animateLoop = () => {
      requestAnimationFrame(animateLoop);
      
      // 애니메이션 업데이트 (항상 실행)
      if (bookMixerRef.current) {
        const deltaTime = clock.getDelta();
        bookMixerRef.current.update(deltaTime);
        
        // 애니메이션 완료 확인
        if (animationActionRef.current && animationTypeRef.current) {
          const time = animationActionRef.current.time;
          const duration = animationActionRef.current.getClip().duration;
          
          // 책펼치기: 0~50% 구간에서만 재생하고 완료 후 50% 상태 유지
          if (animationTypeRef.current === 'open' && time >= duration * 0.5) {
            console.log('책펼치기 완료 (0~50%):', time, duration * 0.5);
            animationActionRef.current.time = duration * 0.5; // 50% 상태로 고정
            animationActionRef.current.paused = true;
            animationActionRef.current.enabled = true; // 애니메이션 상태 유지
            setIsAnimating(false);
            setHasPlayed(true);
            animationTypeRef.current = null;
          }
          // 책닫기: 50~100% 구간에서만 재생하고 완료 후 100% 상태 유지
          else if (animationTypeRef.current === 'close' && time >= duration) {
            console.log('책닫기 완료 (50~100%):', time, duration);
            animationActionRef.current.time = duration; // 100% 상태로 고정
            animationActionRef.current.paused = true;
            animationActionRef.current.enabled = true; // 애니메이션 상태 유지
            setIsAnimating(false);
            setHasPlayed(true);
            animationTypeRef.current = null;
          }
        }
      }
      
      controls.update();
      renderer.render(scene, camera);
    };

    // 윈도우 리사이즈 핸들러
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animateLoop();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 애니메이션 재생 함수들
  const openBook = () => {
    if (animationActionRef.current) {
      console.log('책펼치기 시작 (0~50%)');
      setIsAnimating(true);
      setHasPlayed(false);
      animationTypeRef.current = 'open';
      animationActionRef.current.reset();
      animationActionRef.current.time = 0; // 0%에서 시작
      animationActionRef.current.paused = false;
      animationActionRef.current.play();
    }
  };

  const closeBook = () => {
    if (animationActionRef.current) {
      console.log('책닫기 시작 (50~100%)');
      setIsAnimating(true);
      setHasPlayed(false);
      animationTypeRef.current = 'close';
      animationActionRef.current.reset();
      animationActionRef.current.time = animationActionRef.current.getClip().duration * 0.5; // 50% 지점에서 시작
      animationActionRef.current.paused = false;
      animationActionRef.current.play();
    }
  };

  return (
    <div className="w-full h-screen">
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ position: 'relative' }}
      />
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">📚 대단계 - 단일 책</h1>
        <p className="text-sm">마우스로 드래그하여 회전, 휠로 확대/축소</p>
      </div>
      
      {/* 애니메이션 재생 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={openBook}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isAnimating
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          책펼치기
        </button>
        <button
          onClick={closeBook}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isAnimating
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
          }`}
        >
          책닫기
        </button>
      </div>
      
      {/* 3D 모델 크레딧 정보 */}
      <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-sm">
        <h3 className="text-sm font-bold mb-2">📄 3D 모델 크레딧</h3>
        <p className="text-xs">
          This work is based on "{BOOK_MODEL_CREDIT.title}" (
          <a 
            href={BOOK_MODEL_CREDIT.source} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline"
          >
            {BOOK_MODEL_CREDIT.source}
          </a>) by {BOOK_MODEL_CREDIT.author} licensed under {BOOK_MODEL_CREDIT.license}
        </p>
      </div>
    </div>
  );
}
