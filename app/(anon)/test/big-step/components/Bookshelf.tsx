import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getKTX2Loader, getDRACOLoader } from '@utils/ktx2loader';

interface BookshelfProps {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
  renderer?: THREE.WebGLRenderer; // WebGL 렌더러 (KTX2 지원 감지용)
}

export const createBookshelf = (props: BookshelfProps = {}): Promise<THREE.Group> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    renderer
  } = props;

  const startTime = Date.now();
  console.log(`[Bookshelf] 로딩 시작: ${new Date(startTime).toLocaleTimeString()}`);

  return new Promise((resolve, reject) => {
    // 싱글톤 로더 인스턴스 가져오기
    const dracoLoader = getDRACOLoader();
    const ktx2Loader = getKTX2Loader(renderer);
    
    if (renderer) {
      console.log('[Bookshelf] KTX2 지원 감지 완료');
    } else {
      console.warn('[Bookshelf] renderer가 제공되지 않아 KTX2 지원 감지를 건너뜁니다');
    }
    
    // GLTF 로더 생성 및 DRACO, KTX2 로더 연결
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    
    // 로더 설정
    loader.setCrossOrigin('anonymous');
    
    console.log('[Bookshelf] 모델 로딩 시작:', '/models/bookshelf/scene-draco-ktx.glb');
    loader.load(
      '/models/bookshelf/scene-draco-ktx.glb',
      (gltf: GLTF) => {
        try {
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
          console.error('Error processing bookshelf model:', error);
          reject(error);
        }
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
  });
};
