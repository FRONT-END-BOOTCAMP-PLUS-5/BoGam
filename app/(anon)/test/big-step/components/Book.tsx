import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer, AnimationClip } from 'three';

/**
 * Note book 3D 모델 정보
 * 
 * Model Information:
 * - title: Note book
 * - source: https://sketchfab.com/3d-models/note-book-83c74e7caab14bd696320f87b8507fd1
 * - author: Skreater (https://sketchfab.com/Skreater)
 * 
 * Model License:
 * - license type: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
 * - requirements: Author must be credited. Commercial use is allowed.
 * 
 * IMPORTANT: If you use this 3D model in your project be sure to copy paste this credit wherever you share it:
 * This work is based on "Note book" (https://sketchfab.com/3d-models/note-book-83c74e7caab14bd696320f87b8507fd1) 
 * by Skreater (https://sketchfab.com/Skreater) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
 * 
 * 라이선스 요구사항: 이 모델을 사용하는 모든 프로젝트에서 위의 크레딧 정보를 반드시 포함해야 합니다.
 */

// 라이선스 크레딧 정보를 상수로 정의
export const BOOK_MODEL_CREDIT = {
  title: "Note book",
  source: "https://sketchfab.com/3d-models/note-book-83c74e7caab14bd696320f87b8507fd1",
  author: "Skreater (https://sketchfab.com/Skreater)",
  license: "CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)",
  fullCredit: "This work is based on \"Note book\" (https://sketchfab.com/3d-models/note-book-83c74e7caab14bd696320f87b8507fd1) by Skreater (https://sketchfab.com/Skreater) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)"
};

interface BookProps {
  position?: THREE.Vector3; // 책의 위치
  rotation?: THREE.Euler; // 책의 회전
  scale?: THREE.Vector3; // 책의 스케일
}

export const createBook = (props: BookProps = {}): Promise<{ group: THREE.Group; mixer?: AnimationMixer }> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1)
  } = props;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/Book/book.glb',
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
            
            // 기존 재질 정보를 보존하면서 색상만 변경
            if (child.material) {
              // 기존 재질이 MeshStandardMaterial인 경우
              if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.color.setHex(0xffffff); // 흰색으로 변경
                child.material.roughness = 0.2; // 거칠기 조정
                child.material.metalness = 0.0; // 금속성 조정
              } else {
                // 다른 재질인 경우 새로운 MeshStandardMaterial로 교체
                const newMaterial = new THREE.MeshStandardMaterial({
                  color: 0xffffff, // 흰색으로 설정
                  roughness: 0.2,
                  metalness: 0.0,
                  transparent: false,
                  opacity: 1.0
                });
                child.material = newMaterial;
              }
            } else {
              // 재질이 없는 경우 새로운 재질 생성
              const newMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff, // 흰색으로 설정
                roughness: 0.2,
                metalness: 0.0,
                transparent: false,
                opacity: 1.0
              });
              child.material = newMaterial;
            }
            
            child.material.needsUpdate = true;
          }
        });
        
        // 애니메이션 설정
        let mixer: AnimationMixer | undefined;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new AnimationMixer(bookModel);
          
          // 모든 애니메이션 클립에 대해 설정
          gltf.animations.forEach((clip: AnimationClip) => {
            const action = mixer!.clipAction(clip);
            action.loop = THREE.LoopOnce; // 한 번만 재생
            action.clampWhenFinished = true; // 애니메이션 끝나면 마지막 프레임 유지
            action.enabled = true;
          });
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
  });
};
