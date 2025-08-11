import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface BookshelfProps {
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

export const createBookshelf = (props: BookshelfProps = {}): Promise<THREE.Group> => {
  const {
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1)
  } = props;

  return new Promise((resolve, reject) => {
    // DRACO 로더 생성 및 설정
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    
    // GLTF 로더 생성 및 DRACO 로더 연결
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    
    // 로더 설정
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      '/models/bookshelf/scene_compressed.glb',
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
