'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBook, BOOK_MODEL_CREDIT } from './components/Book';

export default function BigStepPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef<{ [key: string]: boolean }>({}); // 각 책마다 독립적인 애니메이션 상태
  const hasPlayedRef = useRef<{ [key: string]: boolean }>({}); // 각 책마다 독립적인 재생 상태
  const bookStateRef = useRef<{ [key: string]: 'closed' | 'open' }>({}); // 여러 책의 상태를 관리
  const animationTypeRef = useRef<{ [key: string]: 'open' | 'close' | null }>({});
  const bookMixerRef = useRef<{ [key: string]: THREE.AnimationMixer | undefined }>({});
  const animationActionRef = useRef<{ [key: string]: THREE.AnimationAction | undefined }>({});
  const bookRef = useRef<{ [key: string]: THREE.Group | null }>({}); // 여러 책 모델 참조
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);

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
    camera.position.set(0, 12, 25); // 카메라를 더 뒤로 이동하여 모든 책이 보이도록 조정

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
    controls.minDistance = 12; // 최소 거리 증가
    controls.maxDistance = 50; // 최대 거리 증가

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
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // 책 생성 및 추가
    const loadBooks = async () => {
      try {
        // 여러 책의 위치 설정 - 2x3 배치로 변경 (가로 2개, 세로 3개)
        const bookPositions = [
          { id: 'book1', position: new THREE.Vector3(-5, 1, -8) },
          { id: 'book2', position: new THREE.Vector3(5, 1, -8) },
          { id: 'book3', position: new THREE.Vector3(-5, 1, 0) },
          { id: 'book4', position: new THREE.Vector3(5, 1, 0) },
          { id: 'book5', position: new THREE.Vector3(-5, 1, 8) },
          { id: 'book6', position: new THREE.Vector3(5, 1, 8) }
        ];

        for (const bookConfig of bookPositions) {
          const { group: book, mixer } = await createBook({
            position: bookConfig.position,
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(0.4, 0.4, 0.3)
          });
          
          // 책의 위치를 명시적으로 설정
          book.position.copy(bookConfig.position);
          
          scene.add(book);
          bookRef.current[bookConfig.id] = book;
          bookMixerRef.current[bookConfig.id] = mixer;
          bookStateRef.current[bookConfig.id] = 'closed';
          animationTypeRef.current[bookConfig.id] = null;
          isAnimatingRef.current[bookConfig.id] = false;
          hasPlayedRef.current[bookConfig.id] = false;
          
          // 애니메이션 액션 설정
          if (mixer) {
            // 믹서에서 직접 액션을 가져오기
            const actions = (mixer as any)._actions || [];
            if (actions.length > 0) {
              animationActionRef.current[bookConfig.id] = actions[0];
              actions[0].loop = THREE.LoopOnce;
              actions[0].clampWhenFinished = true;
              actions[0].enabled = true;
            }
          }
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    loadBooks();

    // Raycaster 초기화
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    // 애니메이션 재생 함수들 (useEffect 내부에서 정의)
    const openBook = (bookId: string) => {
      if (animationActionRef.current[bookId]) {
        isAnimatingRef.current[bookId] = true;
        hasPlayedRef.current[bookId] = false;
        animationTypeRef.current[bookId] = 'open';
        const action = animationActionRef.current[bookId];
        action.reset();
        action.time = 0; // 0%에서 시작
        action.paused = false;
        action.enabled = true;
        action.play();
      }
    };

    const closeBook = (bookId: string) => {
      if (animationActionRef.current[bookId]) {
        isAnimatingRef.current[bookId] = true;
        hasPlayedRef.current[bookId] = false;
        animationTypeRef.current[bookId] = 'close';
        const action = animationActionRef.current[bookId];
        action.reset();
        action.time = action.getClip().duration * 0.5; // 50% 지점에서 시작
        action.paused = false;
        action.enabled = true;
        action.play();
      }
    };

    // 마우스 클릭 이벤트 핸들러
    const handleMouseClick = (event: MouseEvent) => {
      if (!raycasterRef.current || !mouseRef.current || !bookRef.current || !camera) {
        return;
      }

      event.preventDefault();

      // gapX, gapY 계산 (DOM 영역 외부의 공백)
      const gapX = event.clientX - event.offsetX;
      const gapY = event.clientY - event.offsetY;
      
      // 마우스 위치를 정규화된 디바이스 좌표로 변환 (-1 ~ 1)
      mouseRef.current.x = ((event.clientX - gapX) / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - gapY) / window.innerHeight) * 2 + 1;

      // Raycaster를 사용하여 마우스 위치에서 광선 생성
      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      // 책 모델과의 교차 검사
      for (const bookId in bookRef.current) {
        const book = bookRef.current[bookId];
        if (book) {
          const intersects = raycasterRef.current.intersectObject(book, true);

          if (intersects.length > 0) {
            if (!isAnimatingRef.current[bookId] && animationActionRef.current[bookId]) {
              // bookState를 반전시켜서 토글
              if (bookStateRef.current[bookId] === 'closed') {
                bookStateRef.current[bookId] = 'open';
                openBook(bookId);
              } else {
                bookStateRef.current[bookId] = 'closed';
                closeBook(bookId);
              }
            }
          }
        }
      }
    };

    // 마우스 클릭 이벤트 리스너 추가 (renderer의 DOM 요소에 직접 추가)
    renderer.domElement.addEventListener('click', handleMouseClick);

    // 애니메이션 함수
    const clock = new THREE.Clock();
    const animateLoop = () => {
      requestAnimationFrame(animateLoop);
      
      const deltaTime = clock.getDelta();
      
      // 애니메이션 업데이트 (항상 실행)
      for (const bookId in bookMixerRef.current) {
        const mixer = bookMixerRef.current[bookId];
        if (mixer) {
          mixer.update(deltaTime);
          
          // 애니메이션 완료 확인
          if (animationActionRef.current[bookId] && animationTypeRef.current[bookId]) {
            const action = animationActionRef.current[bookId];
            const time = action.time;
            const duration = action.getClip().duration;
            
            // 책펼치기: 0~50% 구간에서만 재생하고 완료 후 50% 상태 유지
            if (animationTypeRef.current[bookId] === 'open' && time >= duration * 0.5) {
              action.time = duration * 0.5; // 50% 상태로 고정
              action.paused = true;
              action.enabled = true; // 애니메이션 상태 유지
              isAnimatingRef.current[bookId] = false;
              hasPlayedRef.current[bookId] = true;
              animationTypeRef.current[bookId] = null;
            }
            // 책닫기: 50~100% 구간에서만 재생하고 완료 후 100% 상태 유지
            else if (animationTypeRef.current[bookId] === 'close' && time >= duration) {
              action.time = duration; // 100% 상태로 고정
              action.paused = true;
              action.enabled = true; // 애니메이션 상태 유지
              isAnimatingRef.current[bookId] = false;
              hasPlayedRef.current[bookId] = true;
              animationTypeRef.current[bookId] = null;
            }
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
      renderer.domElement.removeEventListener('click', handleMouseClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

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
        <p className="text-sm mt-2">💡 <strong>책을 클릭하면 애니메이션이 재생됩니다!</strong></p>
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
