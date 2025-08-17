import { useAnimations } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { useLoaders } from '@utils/useLoaders';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * Book 3D 모델 정보
 * 
 * Model Information:
 * - title: Book
 * - source: https://sketchfab.com/3d-models/book-616e0dd72bf04503a350d774f48a6e6c
 * 
 * 라이선스 정보는 해당 Sketchfab 페이지에서 확인하세요.
 */

interface BookProps {
  position?: [number, number, number];
  bookId: number;
  onBookClick?: (bookId: number) => void;
  isAnyBookOpen?: boolean;
  onBookClose?: (bookId: number) => void;
  isEnvironmentLoaded?: boolean;
}

export default function Book({ 
  position = [0, 0, 0],
  bookId,
  onBookClick,
  isAnyBookOpen = false,
  onBookClose,
  isEnvironmentLoaded = false
}: BookProps) {
  // 커스텀 훅을 사용하여 로더 관리 (Canvas 내부에서만 사용)
  const { ktx2, gltf: gltfLoader } = useLoaders();
  const modelRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const { actions } = useAnimations(gltf?.animations || [], modelRef);
  const [isLoading, setIsLoading] = useState(true);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 기본값들
  const scale: [number, number, number] = useMemo(() => [1, 1, 1], []);
  const textureNumberRef = useRef(bookId); // useRef로 안정적인 참조 생성

  const initialPosition: [number, number, number] = position;

  // 모델 로딩
  useEffect(() => {
    if (!gltfLoader || !ktx2 || !isEnvironmentLoaded) return;

    setIsLoading(true);
    
    gltfLoader.load(
      '/models/optimized/book-draco-ktx.glb',
      async (loadedGltf: GLTF) => {
        try {
          // 텍스처 로딩 및 적용
          if (textureNumberRef.current >= 1 && textureNumberRef.current <= 7) {
            const texturePath = `/models/textures/book${textureNumberRef.current}_baseColor.ktx2`;
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
        } catch (error) {
          console.error('텍스처 변경 중 오류:', error);
          setIsTextureLoaded(false);
          setGltf(loadedGltf); // 텍스처 실패해도 모델은 로딩
          setIsLoading(false);
        }
      },
      undefined,
      (error: unknown) => {
        console.error('모델 로딩 실패:', error);
        setIsLoading(false);
      }
    );
  }, [gltfLoader, ktx2, isEnvironmentLoaded]); // isEnvironmentLoaded 추가

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // gltf scene 정리
      if (gltf?.scene) {
        gltf.scene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if (mat instanceof THREE.MeshStandardMaterial && mat.map) {
                    mat.map.dispose();
                  }
                  mat.dispose();
                });
              } else {
                if (child.material instanceof THREE.MeshStandardMaterial && child.material.map) {
                  child.material.map.dispose();
                }
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [gltf]);

  // 모델 초기 설정을 위한 ref
  const isInitialized = useRef(false);
  
  // 모델 초기 설정 (한 번만 실행)
  useEffect(() => {
    if (gltf?.scene && modelRef.current && !isInitialized.current) {
      console.log(`📚 Book ${bookId} 초기화 시작`);
      
      // 모델 스케일과 위치, 회전 조정
      modelRef.current.scale.set(...scale);
      modelRef.current.position.set(...initialPosition);
      modelRef.current.rotation.set(Math.PI / 2, 0, -Math.PI / 2); // 90도 회전
      
      // 모든 메시에 클릭 이벤트와 그림자 설정 추가
      gltf.scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // 클릭 이벤트를 위한 사용자 데이터 설정
          child.userData = {
            ...child.userData,
            isClickable: true,
            bookId: bookId
          };
          
          // 메시의 geometry가 클릭 가능하도록 설정
          if (child.geometry) {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
          }
        }
      });
      
      // 애니메이션을 0프레임에서 시작하도록 설정
      if (actions && Object.keys(actions).length > 0) {
        const action = actions[Object.keys(actions)[0]];
        if (action) {
          action.time = 0;
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          action.paused = true;
        }
      }
      
      // 초기화 완료 표시
      isInitialized.current = true;
      console.log(`📚 Book ${bookId} 초기화 완료`);
    }
  }, [gltf, actions, initialPosition, scale, bookId]); // bookId 추가

  // 책 열기 애니메이션 (이동 → 회전 → 열기)
  const playOpenAnimation = () => {
    if (!actions || Object.keys(actions).length === 0 || !modelRef.current) return;
    
    const targetPosition = [1.36, 7.5, -1];
    
    // 1️⃣ 먼저 위치 이동
    gsap.to(modelRef.current.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 0.3,
      onComplete: () => {
        // 2️⃣ 이동 완료 후 회전
        if (modelRef.current) {
          gsap.to(modelRef.current.rotation, {
            x: Math.PI / 2,  // 90도
            y: 0,
            z: 0, // 0도
            duration: 0.3,
              onComplete: () => {
              // 3️⃣ 회전 완료 후 애니메이션
              const actionName = Object.keys(actions)[0];
              const action = actions[actionName];
              
              if (action) {
                const clip = action.getClip();
                const duration = clip.duration * 0.4; // 0%~40% 구간만 실행
                
                action.reset();
                action.setEffectiveTimeScale(5);
                action.play();
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true; // 열린 상태에서 멈춤

                // 애니메이션이 끝나면 정지하고 열린 상태로 유지
                setTimeout(() => {
                  action.stop(); // 애니메이션 정지하여 40% 지점에서 멈춤
                  
                  // 40% 지점의 상태를 강제로 유지
                  const clip = action.getClip();
                  const targetTime = clip.duration * 0.4;
                  action.time = targetTime;
                  action.paused = true;
                  
                  setIsOpen(true);
                  setIsAnimating(false); // 애니메이션 상태 해제
                  
                  // 애니메이션 완료 후 onBookClick 호출
                  if (onBookClick) {
                    onBookClick(bookId);
                  }
                }, (duration * 1000) / 5); // 5배 빠른 속도이므로 시간도 5배로 줄임
              }
            },
          });
        }
      },
    });
  };

  // 책 닫기 애니메이션 (닫기 → 회전 → 이동)
  const playCloseAnimation = () => {
    if (!actions || Object.keys(actions).length === 0 || !modelRef.current) return;
    
    const actionName = Object.keys(actions)[0];
    const action = actions[actionName];
    
    if (action) {
      const clip = action.getClip();
      const duration = clip.duration * 0.4; // 60%~100% 구간 (40% 지점부터)
      
      // 1️⃣ 먼저 닫기 애니메이션 실행
      action.reset();
      action.time = clip.duration * 0.6;
      action.setEffectiveTimeScale(5); // 5배 속도
      action.play();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;

      // 애니메이션이 끝나면 회전 시작
      setTimeout(() => {
        // 애니메이션을 100% 지점에서 정지 (완전히 닫힌 상태)
        action.time = clip.duration;
        action.paused = true;
        
        // 2️⃣ 회전 시작 (열기의 역순)
        if (modelRef.current) {
          gsap.to(modelRef.current.rotation, {
            x: Math.PI / 2,  // 90도 (초기 상태)
            y: 0,
            z: -Math.PI / 2, // -90도 (초기 상태)
            duration: 0.3,
            onComplete: () => {
              // 3️⃣ 회전 완료 후 이동 시작
              if (modelRef.current) {
                gsap.to(modelRef.current.position, {
                  x: initialPosition[0],
                  y: initialPosition[1],
                  z: initialPosition[2],
                  duration: 0.3,
                                     onComplete: () => {
                     // 모든 애니메이션 완료
                     setIsOpen(false);
                     setIsAnimating(false);
                     
                     // 부모에게 책이 닫혔음을 알림
                     if (onBookClose) {
                       onBookClose(bookId);
                     }
                   }
                });
              }
            }
          });
        }
      }, (duration * 1000) / 5); // 5배 빠른 속도이므로 시간도 5배로 줄임
    }
  };

  // 클릭 핸들러 - 토글 방식
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // 이벤트 전파 완전 차단 - 뒤에 있는 책으로 이벤트 전파 안됨
    event.stopPropagation();
    
    console.log(`📚 Book ${bookId} 클릭됨!`, {
      isAnimating,
      isOpen,
      isAnyBookOpen,
      hasModelRef: !!modelRef.current,
      eventType: event.type
    });
    
    if (isAnimating || !modelRef.current) {
      console.log('❌ 클릭 차단: 애니메이션 중이거나 모델이 없음');
      return;
    }
    
    // 다른 책이 열려있고, 현재 책이 닫혀있으면 클릭 불가
    if (isAnyBookOpen && !isOpen) {
      console.log('❌ 클릭 차단: 다른 책이 열려있음');
      return;
    }
    
    console.log('✅ 클릭 처리 시작');
    setIsAnimating(true);
    
    if (isOpen) {
      console.log('📖 책 닫기 애니메이션 시작');
      playCloseAnimation();
    } else {
      console.log('📖 책 열기 애니메이션 시작');
      playOpenAnimation();
    }
  };

  // 모델 로딩 완료 시 초기 설정 (한 번만 실행) - 제거 (위의 useEffect로 통합)
  // useEffect(() => {
  //   if (gltf?.scene && modelRef.current && !isOpen) {
  //     // 모델 스케일과 위치, 회전 조정 (닫힌 상태일 때만)
  //     modelRef.current.scale.set(...scale);
  //     modelRef.current.position.set(...initialPosition);
  //     modelRef.current.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  //     
  //     // 모델에 그림자 설정
  //     gltf.scene.traverse((child: THREE.Object3D) => {
  //       if (child instanceof THREE.Mesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });

  //     // 애니메이션을 0프레임에서 시작하도록 설정
  //     if (actions && Object.keys(actions).length > 0) {
  //       const actionName = Object.keys(actions)[0];
  //       const action = actions[actionName];
  //       
  //       if (action) {
  //         action.time = 0;
  //         action.setLoop(THREE.LoopOnce, 1);
  //         action.clampWhenFinished = true;
  //         action.play();
  //         action.paused = true;
  //       }
  //     }
  //   }
  // }, [gltf, actions, isOpen]);

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
