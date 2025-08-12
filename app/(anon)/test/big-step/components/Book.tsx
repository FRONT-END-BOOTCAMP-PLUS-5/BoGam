<<<<<<< HEAD
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer, AnimationClip, AnimationAction } from 'three';
=======
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnimationMixer, AnimationClip, AnimationAction, TextureLoader } from 'three';
import { initializeCommonGLTFLoader, getCommonTextureLoader, loadModelFromCache } from '@utils/gltfTextureLoaders';
>>>>>>> develop

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
  position?: THREE.Vector3; // 책의 위치
  rotation?: THREE.Euler; // 책의 회전
  scale?: THREE.Vector3; // 책의 스케일
  id: string; // 책의 고유 ID
<<<<<<< HEAD
=======
  renderer?: THREE.WebGLRenderer; // WebGL 렌더러 (KTX2 지원 감지용)
  bookId?: string; // 책 번호 (book1, book2, ...)
>>>>>>> develop
}

// 책의 상태를 관리하는 클래스
export class BookController {
  private id: string;
<<<<<<< HEAD
  private group: THREE.Group;
  private mixer?: AnimationMixer;
=======
  public group: THREE.Group;
  public mixer?: AnimationMixer;
>>>>>>> develop
  private action?: AnimationAction;
  private state: 'closed' | 'open' = 'closed';
  private isAnimating: boolean = false;
  private hasPlayed: boolean = false;
  private animationType: 'open' | 'close' | null = null;
  
  // 원래 위치와 회전 저장
  private originalPosition: THREE.Vector3;
  private originalRotation: THREE.Euler;
  private isInCenter: boolean = false;
  
  // 이동 애니메이션 관련 변수
  private isMoving: boolean = false;
  private moveStartPosition: THREE.Vector3;
  private moveTargetPosition: THREE.Vector3;
  private moveStartRotation: THREE.Euler;
  private moveTargetRotation: THREE.Euler;
  private moveProgress: number = 0;
  private moveDuration: number = 0.4; // 이동에 걸리는 시간 (초)
  
<<<<<<< HEAD
  // 모든 BookController 인스턴스를 추적하기 위한 정적 배열
  private static allControllers: BookController[] = [];

  constructor(id: string, group: THREE.Group, mixer?: AnimationMixer) {
=======
  // 링크 URL 저장
  public linkUrl: string;
  
  // 모든 BookController 인스턴스를 추적하기 위한 정적 배열
  private static allControllers: BookController[] = [];

  constructor(id: string, group: THREE.Group, mixer?: AnimationMixer, linkUrl?: string) {
>>>>>>> develop
    this.id = id;
    this.group = group;
    this.mixer = mixer;
    
<<<<<<< HEAD
=======
    // 링크 URL 설정 (기본값: /step1, /step2 등)
    this.linkUrl = linkUrl || `/step${id.replace('book', '')}`;
    
>>>>>>> develop
    // 원래 위치와 회전 저장
    this.originalPosition = group.position.clone();
    this.originalRotation = group.rotation.clone();
    
    // 이동 관련 변수 초기화
    this.moveStartPosition = group.position.clone();
    this.moveTargetPosition = group.position.clone();
    this.moveStartRotation = group.rotation.clone();
    this.moveTargetRotation = group.rotation.clone();
    
    if (mixer) {
      // 믹서에서 직접 액션을 가져오기
      const actions = (mixer as any)._actions || [];
      if (actions.length > 0) {
        this.action = actions[0] as AnimationAction;
        if (this.action) {
          this.action.loop = THREE.LoopOnce;
          this.action.clampWhenFinished = true;
          this.action.enabled = true;
        }
      }
    }
    
    // 생성된 인스턴스를 정적 배열에 추가
    BookController.allControllers.push(this);
  }

  // 애니메이션 업데이트
  update(deltaTime: number): void {
    // 이동 애니메이션 업데이트
    if (this.isMoving) {
      this.moveProgress += deltaTime / this.moveDuration;
      
      if (this.moveProgress >= 1.0) {
        // 이동 완료
        this.moveProgress = 1.0;
        this.isMoving = false;
        this.group.position.copy(this.moveTargetPosition);
        this.group.rotation.copy(this.moveTargetRotation);
      } else {
        // 부드러운 이동 (easeInOut 효과)
        const easedProgress = this.easeInOutCubic(this.moveProgress);
        
        // 위치 보간
        this.group.position.lerpVectors(
          this.moveStartPosition,
          this.moveTargetPosition,
          easedProgress
        );
        
        // 회전 보간
        this.group.rotation.x = THREE.MathUtils.lerp(
          this.moveStartRotation.x,
          this.moveTargetRotation.x,
          easedProgress
        );
        this.group.rotation.y = THREE.MathUtils.lerp(
          this.moveStartRotation.y,
          this.moveTargetRotation.y,
          easedProgress
        );
        this.group.rotation.z = THREE.MathUtils.lerp(
          this.moveStartRotation.z,
          this.moveTargetRotation.z,
          easedProgress
        );
      }
    }
    
    // 애니메이션 믹서 업데이트
    if (this.mixer && this.action) {
      this.mixer.update(deltaTime);
      
      // 애니메이션 완료 확인
      if (this.animationType) {
        const action = this.action;
        const time = action.time;
        const duration = action.getClip().duration;
        
<<<<<<< HEAD
        // 책펼치기: 0~40% 구간에서만 재생하고 완료 후 40% 상태 유지
        if (this.animationType === 'open' && time >= duration * 0.4) {
          action.time = duration * 0.4; // 40% 상태로 고정
          action.paused = true;
          action.enabled = true; // 애니메이션 상태 유지
          this.isAnimating = false;
          this.hasPlayed = true;
          this.animationType = null;
        }
=======
                 // 책펼치기: 0~40% 구간에서만 재생하고 완료 후 40% 상태 유지
         if (this.animationType === 'open' && time >= duration * 0.4) {
           action.time = duration * 0.4; // 40% 상태로 고정
           action.paused = true;
           action.enabled = true; // 애니메이션 상태 유지
           this.isAnimating = false;
           this.hasPlayed = true;
           this.animationType = null;
           
           // 애니메이션 완료 후 링크로 이동
           setTimeout(() => {
             this.navigateToLink();
           }, 100); // 0.1초 후 링크 이동
         }
>>>>>>> develop
        // 책닫기: 60~100% 구간에서만 재생하고 완료 후 100% 상태 유지
        else if (this.animationType === 'close' && time >= duration) {
          action.time = duration; // 100% 상태로 고정
          action.paused = true;
          action.enabled = true; // 애니메이션 상태 유지
          this.isAnimating = false;
          this.hasPlayed = true;
          this.animationType = null;
          
          // 닫기 애니메이션 완료 후 원래 위치로 복귀
          if (this.isInCenter) {
            setTimeout(() => {
              this.returnToOriginal();
            }, 500);
          }
        }
      }
    }
  }

  // 책 열기
  open(): void {
    if (this.action && !this.isAnimating) {
      // 다른 모든 책들을 닫기
      this.closeOtherBooks();
      
      // 열려있는 책이 있는지 확인 (닫기 애니메이션 중인 책도 포함)
      const hasOpenOrClosingBooks = BookController.allControllers.some(controller => 
        controller !== this && (controller.state === 'open' || controller.isAnimating)
      );
      
      if (hasOpenOrClosingBooks) {
        // 기존 책이 닫히고 들어갈 때까지 지연
        setTimeout(() => {
          this.startOpenSequence();
        }, 1200); // 기존 책이 닫히고 들어갈 때까지 1.2초 대기
      } else {
        // 열려있는 책이 없으면 바로 열기
        this.startOpenSequence();
      }
    }
  }

  // 열기 시퀀스 시작
  private startOpenSequence(): void {
    this.isAnimating = true;
    this.hasPlayed = false;
    this.animationType = 'open';
    this.state = 'open';
    
    // 1단계: 화면 앞으로 평행이동하고 중앙으로 이동
    this.moveToCenter();
    
    // 2단계: z축 90도 회전
    setTimeout(() => {
      this.rotateToFront();
      
      // 3단계: 애니메이션 재생
      setTimeout(() => {
        this.playOpenAnimation();
      }, 500);
    }, 500);
  }

  // 책 닫기
  close(): void {
    if (this.action && !this.isAnimating) {
      this.isAnimating = true;
      this.hasPlayed = false;
      this.animationType = 'close';
      this.state = 'closed';
      
      // 1단계: 애니메이션 재생
      this.playCloseAnimation();
      
      // 2단계: 애니메이션 완료 후 원래 위치로 복귀
      setTimeout(() => {
        this.returnToOriginal();
      }, 1000);
    }
  }

  // 중앙으로 이동
  private moveToCenter(): void {
    // 현재 위치와 회전을 시작점으로 설정
    this.moveStartPosition.copy(this.group.position);
    this.moveStartRotation.copy(this.group.rotation);
    
    // 목표 위치와 회전 설정 (화면 앞으로 이동)
    this.moveTargetPosition.set(1.36, 6, 0);
    this.moveTargetRotation.set(Math.PI / 2, 0, -Math.PI / 2);
    
<<<<<<< HEAD
    // 콘솔 로그 출력 (이동만)
    console.log(`[${this.id}] moveToCenter:`);
    console.log(`  시작 위치: (${this.moveStartPosition.x.toFixed(2)}, ${this.moveStartPosition.y.toFixed(2)}, ${this.moveStartPosition.z.toFixed(2)})`);
    console.log(`  목표 위치: (${this.moveTargetPosition.x.toFixed(2)}, ${this.moveTargetPosition.y.toFixed(2)}, ${this.moveTargetPosition.z.toFixed(2)})`);
    
=======
>>>>>>> develop
    // 이동 애니메이션 시작
    this.moveProgress = 0;
    this.isMoving = true;
    this.isInCenter = true;
  }

  // z축 90도 회전
  private rotateToFront(): void {
    // 현재 위치와 회전을 시작점으로 설정
    this.moveStartPosition.copy(this.group.position);
    this.moveStartRotation.copy(this.group.rotation);
    
    // 목표 회전 설정 (z축 90도)
    this.moveTargetPosition.copy(this.group.position); // 위치는 그대로
    this.moveTargetRotation.set(Math.PI / 2, 0, 0);
    
    // 회전 애니메이션 시작
    this.moveProgress = 0;
    this.isMoving = true;
  }

  // 펼치기 애니메이션 재생
  private playOpenAnimation(): void {
    if (this.action) {
      this.action.reset();
      this.action.time = 0; // 0%에서 시작
      this.action.paused = false;
      this.action.enabled = true;
      this.action.play();
    }
  }

  // 닫기 애니메이션 재생
  private playCloseAnimation(): void {
    if (this.action) {
      this.action.reset();
      this.action.time = this.action.getClip().duration * 0.6; // 60% 지점에서 시작
      this.action.paused = false;
      this.action.enabled = true;
      this.action.play();
    }
  }

  // easeInOutCubic 함수 (부드러운 이동을 위한 이징 함수)
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // 다른 모든 책들을 닫는 메서드
  private closeOtherBooks(): void {
    BookController.allControllers.forEach(controller => {
      if (controller !== this && controller.state === 'open') {
        controller.close();
      }
    });
  }

  // 원래 위치로 복귀
  private returnToOriginal(): void {
    // 현재 위치와 회전을 시작점으로 설정
    this.moveStartPosition.copy(this.group.position);
    this.moveStartRotation.copy(this.group.rotation);
    
    // 목표 위치와 회전 설정 (원래 위치)
    this.moveTargetPosition.copy(this.originalPosition);
    this.moveTargetRotation.copy(this.originalRotation);
    
<<<<<<< HEAD
    // 콘솔 로그 출력 (이동만)
    console.log(`[${this.id}] returnToOriginal:`);
    console.log(`  시작 위치: (${this.moveStartPosition.x.toFixed(2)}, ${this.moveStartPosition.y.toFixed(2)}, ${this.moveStartPosition.z.toFixed(2)})`);
    console.log(`  목표 위치: (${this.moveTargetPosition.x.toFixed(2)}, ${this.moveTargetPosition.y.toFixed(2)}, ${this.moveTargetPosition.z.toFixed(2)})`);
    
=======
>>>>>>> develop
    // 이동 애니메이션 시작
    this.moveProgress = 0;
    this.isMoving = true;
    this.isInCenter = false;
    this.isAnimating = false;
  }

<<<<<<< HEAD
=======
  // 링크로 이동하는 메서드
  private navigateToLink(): void {
    console.log(`[${this.id}] 링크로 이동: ${this.linkUrl}`);
    // 실제 네비게이션은 Scene3D에서 처리
    window.location.href = this.linkUrl;
  }

>>>>>>> develop
  // 클릭 이벤트 처리
  handleClick(): void {
    if (!this.isAnimating) {
      if (this.state === 'closed') {
        this.open();
      } else {
        this.close();
      }
    }
  }

  // 현재 상태 반환
  getState(): 'closed' | 'open' {
    return this.state;
  }

  // 애니메이션 중인지 확인
  isCurrentlyAnimating(): boolean {
    return this.isAnimating;
  }

  // 그룹 반환
  getGroup(): THREE.Group {
    return this.group;
  }

  // 믹서 반환
  getMixer(): AnimationMixer | undefined {
    return this.mixer;
  }
}

<<<<<<< HEAD
=======
import axios from 'axios';

>>>>>>> develop
export const createBook = (props: BookProps): Promise<{ group: THREE.Group; mixer?: AnimationMixer }> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
<<<<<<< HEAD
    scale = new THREE.Vector3(1, 1, 1)
  } = props;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/book/scene.gltf',
      (gltf: GLTF) => {
        const bookGroup = new THREE.Group();
        const bookModel = gltf.scene;
        
        // 모델 스케일 조정
        bookModel.scale.copy(scale);
        
        // 모델에 그림자 설정 및 재질 변경
        bookModel.traverse(async (child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true; // 그림자 생성
            child.receiveShadow = true; // 그림자 받기
          }
        });
        
        // 애니메이션 설정
        let mixer: AnimationMixer | undefined;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(bookModel);
          mixer.timeScale = 6; // 애니메이션 속도를 4배로 설정
          
          gltf.animations.forEach((clip: AnimationClip) => {
            const action = mixer!.clipAction(clip);
            action.loop = THREE.LoopOnce; // 한 번만 재생
            action.clampWhenFinished = true; // 애니메이션 끝나면 마지막 프레임 유지
            action.enabled = true;
            action.play(); // 반드시 play해서 포즈 계산 가능하게 함
            action.paused = true; // 재생 멈춤
            action.time = 0; // 0프레임으로 이동
          });

          // 포즈를 실제로 적용
          mixer.update(0);
        }
        
        // 위치와 회전 설정
        bookGroup.position.copy(position);
        bookGroup.rotation.copy(rotation);
        bookGroup.add(bookModel);
        
        resolve({ group: bookGroup, mixer });
      },
      (progress: ProgressEvent) => {
        // 로딩 진행률 로그 제거
      },
      (error: unknown) => {
        console.error('Error loading book model:', error);
        reject(error);
      }
    );
=======
    scale = new THREE.Vector3(1, 1, 1),
    renderer,
    bookId
  } = props;

  const startTime = Date.now();
  console.log(`[Book] ${bookId || '책'} 생성 시작: ${new Date(startTime).toLocaleTimeString()}`);

  return new Promise(async (resolve, reject) => {
    try {
      // 1. 공통 로더 초기화
      const loader = initializeCommonGLTFLoader(renderer);
      
      // 2. 캐시 우선 모델 로더 사용 (캐시에 있으면 캐시에서, 없으면 다운로드)
       console.log('[Book] 모델 데이터 로드 시작');
       const modelData = await loadModelFromCache('/models/optimized/book-draco-ktx.glb');
       console.log('[Book] 모델 데이터 로드 완료');
      
      // 3. Blob URL 생성 (모델별로 새로 생성)
      const blob = new Blob([modelData], { type: 'model/gltf-binary' });
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('[Book] 모델 파싱 시작:', '/models/optimized/book-draco-ktx.glb');
      
      loader.load(
        blobUrl,
          (gltf: GLTF) => {
            try {
              // Blob URL은 공통으로 사용하므로 정리하지 않음
            
            const bookGroup = new THREE.Group();
            const bookModel = gltf.scene;
            
            // 모델 스케일 조정
            bookModel.scale.copy(scale);
            
            // 모델에 그림자 설정 및 재질 변경
            bookModel.traverse(async (child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true; // 그림자 생성
                child.receiveShadow = true; // 그림자 받기
                
                // 재질이 있는 경우에만 처리
                if (child.material && Array.isArray(child.material)) {
                  child.material.forEach((material: THREE.Material) => {
                    if (material instanceof THREE.MeshStandardMaterial) {
                      material.needsUpdate = true;
                    }
                  });
                } else if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
                  child.material.needsUpdate = true;
                }
              }
            });

            // 각 책마다 다른 텍스처 적용
            if (bookId) {
              console.log(`[Book] ${bookId}에 맞는 텍스처 적용 중...`);
              
              // 공통 텍스처 로더 사용
              const textureLoader = getCommonTextureLoader();
              
              // 책 번호에 따른 베이스컬러 텍스처 경로
              const baseColorTexturePath = `/models/book/textures/${bookId}_baseColor.png`;
              
              try {
                // 베이스컬러 텍스처 로드
                const baseColorTexture = textureLoader.load(baseColorTexturePath);
                
                // 텍스처 설정
                baseColorTexture.colorSpace = THREE.SRGBColorSpace;
                baseColorTexture.flipY = false;
                baseColorTexture.generateMipmaps = true;
                
                // 모델의 재질에 텍스처 적용
                bookModel.traverse((child: THREE.Object3D) => {
                  if (child instanceof THREE.Mesh && child.material) {
                    if (Array.isArray(child.material)) {
                      child.material.forEach((material: THREE.Material) => {
                        if (material instanceof THREE.MeshStandardMaterial) {
                          material.map = baseColorTexture;
                          material.needsUpdate = true;
                        }
                      });
                    } else if (child.material instanceof THREE.MeshStandardMaterial) {
                      child.material.map = baseColorTexture;
                      child.material.needsUpdate = true;
                    }
                  }
                });
                
                console.log(`[Book] ${bookId}에 베이스컬러 텍스처 적용 완료: ${baseColorTexturePath}`);
              } catch (error) {
                console.error(`[Book] ${bookId} 텍스처 로딩 실패:`, error);
              }
            }
            
            // 애니메이션 설정
            let mixer: AnimationMixer | undefined;
            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new AnimationMixer(bookModel);
              mixer.timeScale = 6; // 애니메이션 속도를 6배로 설정
              
              gltf.animations.forEach((clip: AnimationClip) => {
                const action = mixer!.clipAction(clip);
                action.loop = THREE.LoopOnce; // 한 번만 재생
                action.clampWhenFinished = true; // 애니메이션 끝나면 마지막 프레임 유지
                action.enabled = true;
                action.play(); // 반드시 play해서 포즈 계산 가능하게 함
                action.paused = true; // 재생 멈춤
                action.time = 0; // 0프레임으로 이동
              });

              // 포즈를 실제로 적용
              mixer.update(0);
            }
            
            // 위치와 회전 설정
            bookGroup.position.copy(position);
            bookGroup.rotation.copy(rotation);
            bookGroup.add(bookModel);
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            console.log(`[Book] 로딩 완료: ${totalTime}ms`);
                        resolve({ group: bookGroup, mixer });
          } catch (error) {
            // Blob URL 정리
            URL.revokeObjectURL(blobUrl);
            console.error('Error processing book model:', error);
            reject(error);
          }
        },
        (progress: ProgressEvent) => {
          // 로딩 진행률 로그 제거
        },
        (error: unknown) => {
          // Blob URL 정리
          URL.revokeObjectURL(blobUrl);
          console.error('Error loading book model:', error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('[Book] 모델 로딩 중 오류:', error);
      reject(error);
    }
>>>>>>> develop
  });
};
