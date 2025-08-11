import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnimationMixer, AnimationClip, AnimationAction } from 'three';

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
  renderer?: THREE.WebGLRenderer; // WebGL 렌더러 (KTX2 지원 감지용)
}

// 책의 상태를 관리하는 클래스
export class BookController {
  private id: string;
  public group: THREE.Group;
  public mixer?: AnimationMixer;
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
  
  // 링크 URL 저장
  public linkUrl: string;
  
  // 모든 BookController 인스턴스를 추적하기 위한 정적 배열
  private static allControllers: BookController[] = [];

  constructor(id: string, group: THREE.Group, mixer?: AnimationMixer, linkUrl?: string) {
    this.id = id;
    this.group = group;
    this.mixer = mixer;
    
    // 링크 URL 설정 (기본값: /step1, /step2 등)
    this.linkUrl = linkUrl || `/step${id.replace('book', '')}`;
    
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
    
    // 이동 애니메이션 시작
    this.moveProgress = 0;
    this.isMoving = true;
    this.isInCenter = false;
    this.isAnimating = false;
  }

  // 링크로 이동하는 메서드
  private navigateToLink(): void {
    console.log(`[${this.id}] 링크로 이동: ${this.linkUrl}`);
    // 실제 네비게이션은 Scene3D에서 처리
    window.location.href = this.linkUrl;
  }

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

export const createBook = (props: BookProps): Promise<{ group: THREE.Group; mixer?: AnimationMixer }> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    renderer
  } = props;

  const startTime = Date.now();
  console.log(`[Book] 로딩 시작: ${new Date(startTime).toLocaleTimeString()}`);

  return new Promise((resolve, reject) => {
    // DRACO 로더 생성 및 설정
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    
    // KTX2 로더 생성 및 설정
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/basis/');
    ktx2Loader.setCrossOrigin('anonymous');
    
    // renderer가 제공된 경우 KTX2 지원 감지
    if (renderer) {
      ktx2Loader.detectSupport(renderer);
      console.log('[Book] KTX2 지원 감지 완료');
    } else {
      console.warn('[Book] renderer가 제공되지 않아 KTX2 지원 감지를 건너뜁니다');
    }
    
    // GLTF 로더 생성 및 DRACO, KTX2 로더 연결
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    
    // 로더 설정
    loader.setCrossOrigin('anonymous');
    
    console.log('[Book] 모델 로딩 시작:', '/models/book/scene-draco-ktx.glb');
    loader.load(
      '/models/book/scene-draco-ktx.glb',
      (gltf: GLTF) => {
        try {
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
          console.error('Error processing book model:', error);
          reject(error);
        }
      },
      (progress: ProgressEvent) => {
        // 로딩 진행률 로그 제거
      },
      (error: unknown) => {
        console.error('Error loading book model:', error);
        reject(error);
      }
    );
  });
};
