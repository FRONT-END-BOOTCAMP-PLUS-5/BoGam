'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createBook, BookController } from './Book';
import { createBookshelf } from './Bookshelf';

interface Scene3DProps {
  className?: string;
}

export default function Scene3D({ className }: Scene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const bookControllersRef = useRef<{ [key: string]: BookController }>({});
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene 설정
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // 연한 회색 배경

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      60, // FOV를 60으로 설정하여 자연스러운 시야각
      300 / 400, // 고정된 비율 사용
      0.1,
      1000
    );
    camera.position.set(0, 6.2, 7);
    camera.lookAt(0, 6.2, -10);
    camera.updateProjectionMatrix();

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // 로딩 중에는 DOM에 추가하지 않음
    // mountRef.current.appendChild(renderer.domElement);

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.02;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
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

    // 로딩 진행률 추적
    let loadedObjects = 0;
    const totalObjects = 7; // 책꽂이 1개 + 책 6개

    const updateLoadingProgress = () => {
      loadedObjects++;
      const progress = (loadedObjects / totalObjects) * 100;
      setLoadingProgress(progress);
      
      if (loadedObjects === totalObjects) {
        // 모든 오브젝트가 로딩 완료
        setIsLoading(false);
        // 이제 DOM에 렌더러 추가
        mountRef.current?.appendChild(renderer.domElement);
        
        // Raycaster 초기화
        raycasterRef.current = new THREE.Raycaster();
        mouseRef.current = new THREE.Vector2();

        // 마우스 클릭 이벤트 핸들러
        const handleMouseClick = (event: MouseEvent) => {
          if (!raycasterRef.current || !mouseRef.current || !camera) {
            return;
          }

          event.preventDefault();

          mouseRef.current.x = (event.offsetX / 300) * 2 - 1;
          mouseRef.current.y = -(event.offsetY / 400) * 2 + 1;

          raycasterRef.current.setFromCamera(mouseRef.current, camera);

          for (const bookId in bookControllersRef.current) {
            const bookController = bookControllersRef.current[bookId];
            const book = bookController.getGroup();
            
            const intersects = raycasterRef.current.intersectObject(book, true);

            if (intersects.length > 0) {
              bookController.handleClick();
              break;
            }
          }
        };

        renderer.domElement.addEventListener('click', handleMouseClick);

        // 애니메이션 루프 시작
        const clock = new THREE.Clock();
        const animateLoop = () => {
          requestAnimationFrame(animateLoop);
          
          const deltaTime = clock.getDelta();
          
          for (const bookId in bookControllersRef.current) {
            const bookController = bookControllersRef.current[bookId];
            bookController.update(deltaTime);
          }
          
          renderer.render(scene, camera);
        };

        animateLoop();

        // 클린업 함수에 이벤트 리스너 제거 추가
        return () => {
          renderer.domElement.removeEventListener('click', handleMouseClick);
        };
      }
    };

    // 책꽂이 생성 및 추가
    const loadBookshelf = async () => {
      try {
        const bookshelf = await createBookshelf({
          position: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          scale: new THREE.Vector3(0.08, 0.08, 0.08)
        });
        scene.add(bookshelf);
        updateLoadingProgress();
      } catch (error) {
        console.error('Error loading bookshelf:', error);
        updateLoadingProgress(); // 에러가 발생해도 진행률 업데이트
      }
    };

    // 책 생성 및 추가
    const loadBooks = async () => {
      try {
        const bookPositions = [
          { id: 'book1', position: new THREE.Vector3(-1, 10.5, -5) },
          { id: 'book2', position: new THREE.Vector3(1, 10.5, -5) },
          { id: 'book3', position: new THREE.Vector3(-1, 5.9, -5) },
          { id: 'book4', position: new THREE.Vector3(1, 5.9, -5) },
          { id: 'book5', position: new THREE.Vector3(-1, 1.82, -5) },
          { id: 'book6', position: new THREE.Vector3(1, 1.82, -5) },   
        ];

        await Promise.all(
          bookPositions.map(async (bookConfig) => {
            const { group: book, mixer } = await createBook({
              position: bookConfig.position,
              rotation: new THREE.Euler(Math.PI / 2, 0, -Math.PI / 2),
              scale: new THREE.Vector3(1, 1, 1),
              id: bookConfig.id
            });

            book.position.copy(bookConfig.position);

            const bookController = new BookController(bookConfig.id, book, mixer);
            bookControllersRef.current[bookConfig.id] = bookController;

            scene.add(book);
            updateLoadingProgress();
          })
        );
      } catch (error) {
        console.error('Error loading books:', error);
        // 에러가 발생한 경우에도 진행률 업데이트
        for (let i = 0; i < 6; i++) {
          updateLoadingProgress();
        }
      }
    };

    // 모든 오브젝트 로딩 시작
    const loadScene = async () => {
      await loadBookshelf();
      await loadBooks();
    };

    loadScene();

    // 클린업
    return () => {
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={className || "w-72 h-72"}
      style={{ position: 'relative' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">3D 모델 로딩 중...</div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{Math.round(loadingProgress)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
