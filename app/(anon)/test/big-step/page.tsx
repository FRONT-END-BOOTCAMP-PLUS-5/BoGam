'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBook } from './components/Book';

export default function BigStepPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // 연한 회색 배경

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // 바닥 생성
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // 단일 책 생성 및 추가 (기본 텍스처 + 제목)
    let bookMixer: THREE.AnimationMixer | undefined;
    const loadBook = async () => {
      try {
        const { group: book, mixer } = await createBook({
          position: new THREE.Vector3(0, 1, 0),
          rotation: new THREE.Euler(0, 0, 0),
          title: '대단계', // 책 제목만
          fontSize: 36, // 폰트 크기 줄임 (48 -> 36)
          textColor: '#FFFFFF' // 텍스트 색상 (흰색)
        });
        scene.add(book);
        bookMixer = mixer;
      } catch (error) {
        console.error('Error loading book:', error);
      }
    };

    loadBook();

    // 애니메이션 함수
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 애니메이션 mixer 업데이트
      if (bookMixer) {
        const deltaTime = clock.getDelta();
        bookMixer.update(deltaTime);
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

    // 애니메이션 시작
    animate();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
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
        <p className="text-xs mt-2">기본 텍스처 + 흰색 제목 오버레이 (상단 위치)</p>
      </div>
    </div>
  );
}
