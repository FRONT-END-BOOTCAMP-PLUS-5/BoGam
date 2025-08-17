import { useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { useLoaders } from '@utils/useLoaders';
import type { ThreeEvent } from '@react-three/fiber';

interface BookProps {
  bookId: number;
  onBookClick?: (bookId: number) => void;
  onLoad?: () => void;
}

export default function Book({ 
  bookId,
  onBookClick,
  onLoad
}: BookProps) {
  const router = useRouter(); // Next.js 라우터 추가
  
  // 커스텀 훅을 사용하여 로더 관리 (Canvas 내부에서만 사용)
  const { ktx2, gltf: gltfLoader } = useLoaders();
  const modelRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const { actions } = useAnimations(gltf?.animations || [], modelRef);
  const [isLoading, setIsLoading] = useState(true);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false); // 텍스처 로딩 상태 추가
  const [isOpen, setIsOpen] = useState(false); // open/close 상태
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 상태
  
  // 기본값들
  const textureNumber = bookId;
  
  // scale과 initialPosition을 useMemo로 메모이제이션
  const scale = useMemo<[number, number, number]>(() => [0.7, 0.7, 0.7], []);
  
  // 초기 위치 계산 (홀수: 오른쪽, 짝수: 왼쪽)
  const initialPosition = useMemo<[number, number, number]>(() => {
    const isOdd = textureNumber % 2 === 1;
    return [isOdd ? 2.2 : -2.2, 0, 0];
  }, [textureNumber]);

  // 모델 로딩
  useEffect(() => {
    if (!gltfLoader || !ktx2) return;

    setIsLoading(true);
    
    gltfLoader.load(
      '/models/optimized/book-draco-ktx.glb',
      async (loadedGltf: GLTF) => {
        try {
          // 텍스처 로딩 및 적용
          if (textureNumber >= 1 && textureNumber <= 7) {
            const texturePath = `/models/textures/book${textureNumber}_baseColor.ktx2`;
            const newTexture = await ktx2.loadAsync(texturePath);
            
            // 텍스처 필터링 및 밉맵 설정 - 부드럽게 조정
            newTexture.minFilter = THREE.LinearFilter;              // 축소 시 부드럽게
            newTexture.magFilter = THREE.LinearFilter;              // 확대 시 부드럽게
            newTexture.generateMipmaps = false;                     // 밉맵 비활성화 (검게 보이는 문제 해결)
            newTexture.anisotropy = 4;                             // 이방성 필터링 줄임
            newTexture.wrapS = THREE.ClampToEdgeWrapping;          // 텍스처 반복 방지
            newTexture.wrapT = THREE.ClampToEdgeWrapping;          // 텍스처 반복 방지
            
            // 모델의 모든 메시의 베이스컬러 텍스처를 변경
            loadedGltf.scene.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh && child.material) {
                const material = child.material as THREE.MeshStandardMaterial;
                if (material.map) {
                  // 기존 텍스처 dispose
                  material.map.dispose();
                  // 새 텍스처 설정
                  material.map = newTexture;
                  material.needsUpdate = true;
                }
              }
            });
            
                      // 텍스처 로딩 완료 상태 설정
          setIsTextureLoaded(true);
        }
        
        setGltf(loadedGltf);
        setIsLoading(false);
        
        // 로딩 완료 시 콜백 호출
        if (onLoad) {
          onLoad();
        }
        } catch (error) {
          console.error('텍스처 변경 중 오류:', error);
          setIsTextureLoaded(false);
          setGltf(loadedGltf); // 텍스처 실패해도 모델은 로딩
          setIsLoading(false);
        }
      },
      () => {
        // 로딩 진행률 로그 제거
      },
      (error: unknown) => {
        console.error(`Book ${bookId}: 모델 로딩 실패:`, error);
        setIsLoading(false);
      }
    );
  }, [gltfLoader, bookId, ktx2, textureNumber, onLoad]);

  // 애니메이션 완료 후 해당 step 페이지로 이동
  const navigateToStep = () => {
    // 현재 URL에서 user-address-nickname 부분을 추출
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    
    // /[user-address-nickname]/steps/ 형태에서 user-address-nickname 추출
    if (pathParts.length >= 2) {
      const userAddressNickname = pathParts[1];
      const stepUrl = `/${userAddressNickname}/steps/${bookId}`;
      
      console.log(`📚 Book ${bookId} 애니메이션 완료! ${stepUrl}로 이동`);
      router.push(stepUrl);
    } else {
      console.error('❌ URL에서 user-address-nickname을 찾을 수 없음');
    }
  };

  // 책 열기 애니메이션 (이동 + 0% → 40%)
  const playOpenAnimation = () => {
    if (!actions || Object.keys(actions).length === 0 || !modelRef.current) return;
    
    // 1️⃣ 먼저 0.75로 이동
    const targetX = 0.75;
    
    gsap.to(modelRef.current.position, {
      x: targetX,
      duration: 0.3,
      onComplete: () => {
        // 2️⃣ 이동 완료 후 애니메이션
        const actionName = Object.keys(actions)[0];
        const action = actions[actionName];
        
        if (action) {
          const clip = action.getClip();
          const duration = clip.duration * 0.4; // 전체 시간의 40%
          
          action.reset();
          action.setEffectiveTimeScale(5); // 애니메이션 속도 5배
          action.play();
          action.setLoop(THREE.LoopOnce, 1); // 한 번만
          action.clampWhenFinished = true;

          // 타이머로 40% 지점에서 정지 (5배 빠르므로 시간도 1/5)
          setTimeout(() => {
            action.stop();
            setIsOpen(true); // 열린 상태로 변경
            
            // 애니메이션 완료 후 콜백 호출
            if (onBookClick) {
              onBookClick(bookId);
            }
            
            // 해당 step 페이지로 이동
            navigateToStep();
          }, (duration * 1000) / 5);
        }
      },
    });
  };

  // 책 닫기 애니메이션 (60% → 100%)
  const playCloseAnimation = () => {
    if (!actions || Object.keys(actions).length === 0) return;
    
    const actionName = Object.keys(actions)[0];
    const action = actions[actionName];
    
    if (action) {
      const clip = action.getClip();
      const startTime = clip.duration * 0.6; // 60% 지점에서 시작
      const duration = clip.duration * 0.4; // 60%에서 100%까지
      
      action.time = startTime;
      action.setEffectiveTimeScale(5); // 애니메이션 속도 5배
      action.play();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      // 타이머로 100% 지점에서 정지 후 0%로 리셋
      setTimeout(() => {
        action.time = 0; // 0%로 리셋
        action.paused = true;
        setIsOpen(false); // 닫힌 상태로 변경
        
        // 원래 위치로 이동 (modelRef.current가 null이 아닌지 체크)
        if (modelRef.current) {
          gsap.to(modelRef.current.position, {
            x: initialPosition[0], // 원래 초기 위치로
            duration: 0.3,
          });
        }
      }, (duration * 1000) / 5);
    }
  };

  // GSAP 클릭 핸들러 - 토글 방식
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 이벤트 전파 완전 차단 - 뒤에 있는 책으로 이벤트 전파 안됨
    event.stopPropagation();
    
    if (isAnimating || !modelRef.current) return;
    
    setIsAnimating(true);
    
    if (isOpen) {
      // 열린 상태에서 클릭 → 닫기 애니메이션 후 원래 위치로 이동
      playCloseAnimation();
    } else {
      // 닫힌 상태에서 클릭 → 바로 열기 애니메이션
      playOpenAnimation();
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // 애니메이션 완료 후 상태 해제
  };

  // 모델 로딩 완료 시 초기 설정
  useEffect(() => {
    if (gltf?.scene && modelRef.current) {
      // 모델 스케일과 위치, 회전 조정
      modelRef.current.scale.set(...scale);
      modelRef.current.position.set(...initialPosition);
      modelRef.current.rotation.set(Math.PI / 2, 0, 0); // x축으로 90도 회전
      
      // 모델에 그림자 설정
      gltf.scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // 애니메이션을 0프레임에서 시작하도록 설정
      if (actions && Object.keys(actions).length > 0) {
        const actionName = Object.keys(actions)[0];
        const action = actions[actionName];
        
        if (action) {
          action.time = 0; // 0프레임으로 설정
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          action.paused = true; // 0프레임에서 정지
        }
      }
    }
  }, [gltf, actions, initialPosition, scale]);

  // 로딩 중이거나 모델이 없거나 텍스처가 로딩되지 않았으면 아무것도 렌더링하지 않음
  if (isLoading || !gltf?.scene || !isTextureLoaded) {
    return null;
  }

  return (
    <group ref={modelRef}>
      <primitive 
        object={gltf.scene} 
        onClick={handleClick}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => {
          // 이벤트 전파 완전 차단 - 뒤에 있는 책으로 호버 이벤트 전파 안됨
          e.stopPropagation();
          
          // 호버된 메시만 효과 적용 (자식들에 전파하지 않음)
          if (e.object instanceof THREE.Mesh && e.object.material) {
            if (Array.isArray(e.object.material)) {
              e.object.material.forEach((mat: THREE.Material) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.emissive = new THREE.Color(0x333333);
                }
              });
            } else if (e.object.material instanceof THREE.MeshStandardMaterial) {
              e.object.material.emissive = new THREE.Color(0x333333);
            }
          }
        }}
        onPointerOut={(e: ThreeEvent<MouseEvent>) => {
          // 이벤트 전파 완전 차단
          e.stopPropagation();
          
          // 호버 효과 제거 - 호버된 메시만
          if (e.object instanceof THREE.Mesh && e.object.material) {
            if (Array.isArray(e.object.material)) {
              e.object.material.forEach((mat: THREE.Material) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.emissive = new THREE.Color(0x000000);
                }
              });
            } else if (e.object.material instanceof THREE.MeshStandardMaterial) {
              e.object.material.emissive = new THREE.Color(0x000000);
            }
          }
        }}
      />
    </group>
  );
}
