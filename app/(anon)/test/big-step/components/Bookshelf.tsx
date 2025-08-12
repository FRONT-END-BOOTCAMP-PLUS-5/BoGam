<<<<<<< HEAD
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
=======
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initializeCommonGLTFLoader, loadModelFromCache } from '@utils/gltfTextureLoaders';
import axios from 'axios';
>>>>>>> develop

interface BookshelfProps {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
<<<<<<< HEAD
=======
  renderer?: THREE.WebGLRenderer; // WebGL 렌더러 (KTX2 지원 감지용)
>>>>>>> develop
}

export const createBookshelf = (props: BookshelfProps = {}): Promise<THREE.Group> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
<<<<<<< HEAD
    scale = new THREE.Vector3(1, 1, 1)
  } = props;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/bookshelf/scene.gltf',
      (gltf: GLTF) => {
        const bookshelfGroup = new THREE.Group();
        const bookshelfModel = gltf.scene;
        
        // 모델 스케일 조정
        bookshelfModel.scale.copy(scale);
        
        // 모델에 그림자 설정
        bookshelfModel.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // 위치와 회전 설정
        bookshelfGroup.position.copy(position);
        bookshelfGroup.rotation.copy(rotation);
        bookshelfGroup.add(bookshelfModel);
        
        resolve(bookshelfGroup);
      },
      (progress: ProgressEvent) => {
        // 로딩 진행률 로그 (필요시 활성화)
        // console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      (error: unknown) => {
        console.error('Error loading bookshelf model:', error);
        reject(error);
      }
    );
=======
    scale = new THREE.Vector3(1, 1, 1),
    renderer
  } = props;

  const startTime = Date.now();
  console.log(`[Bookshelf] 로딩 시작: ${new Date(startTime).toLocaleTimeString()}`);

  return new Promise(async (resolve, reject) => {
    try {
      // 1. 공통 로더 초기화
      const loader = initializeCommonGLTFLoader(renderer);
      
             // 2. 캐시 우선 모델 로더 사용 (캐시에 있으면 캐시에서, 없으면 다운로드)
       console.log('[Bookshelf] 모델 데이터 로드 시작');
       const modelData = await loadModelFromCache('/models/optimized/bookshelf-draco-ktx.glb');
       console.log('[Bookshelf] 모델 데이터 로드 완료');
      
      console.log('[Bookshelf] 모델 파싱 시작:', '/models/optimized/bookshelf-draco-ktx.glb');
      
      // 3. Blob URL 생성 (모델별로 새로 생성)
      const blob = new Blob([modelData], { type: 'model/gltf-binary' });
      const blobUrl = URL.createObjectURL(blob);
      
      loader.load(
        blobUrl,
        (gltf: GLTF) => {
          try {
            // Blob URL 정리
            URL.revokeObjectURL(blobUrl);
            
            const bookshelfGroup = new THREE.Group();
            const bookshelfModel = gltf.scene;
            
            // 모델 스케일 조정
            bookshelfModel.scale.copy(scale);
            
            // 모델에 그림자 설정
            bookshelfModel.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
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
            
            // 위치와 회전 설정
            bookshelfGroup.position.copy(position);
            bookshelfGroup.rotation.copy(rotation);
            bookshelfGroup.add(bookshelfModel);
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            console.log(`[Bookshelf] 로딩 완료: ${totalTime}ms`);
            
            resolve(bookshelfGroup);
          } catch (error) {
            // Blob URL 정리
            URL.revokeObjectURL(blobUrl);
            console.error('Error processing bookshelf model:', error);
            reject(error);
          }
        },
        (progress: ProgressEvent) => {
          // 로딩 진행률 로그 (필요시 활성화)
          // console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
        },
        (error: unknown) => {
          // Blob URL 정리
          URL.revokeObjectURL(blobUrl);
          console.error('Error loading bookshelf model:', error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('[Bookshelf] 모델 로딩 중 오류:', error);
      reject(error);
    }
>>>>>>> develop
  });
};
