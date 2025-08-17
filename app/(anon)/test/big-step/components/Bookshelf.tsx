import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { useLoaders } from '@utils/useLoaders';
import type { ThreeEvent } from '@react-three/fiber';

interface BookshelfProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export default function Bookshelf({
  position = [0, 4, -5],
  rotation = [0, 0, 0],
  scale = [30, 30, 30]
}: BookshelfProps) {
  // KTX2 로더 초기화 (모델에 KTX2 텍스처가 포함되어 있음)
  const { ktx2, gltf: gltfLoader } = useLoaders();
  const modelRef = useRef<THREE.Group>(null);

  const [scene, setScene] = useState<THREE.Group | null>(null);

  // 모델 로딩
  useEffect(() => {
    if (!gltfLoader || !ktx2) return;

    gltfLoader.load(
      '/models/optimized/bookshelf-draco-ktx.glb',
      (loadedGltf: GLTF) => {
        setScene(loadedGltf.scene);
      },
      undefined,
      (error: unknown) => {
        console.error('Bookshelf 모델 로딩 실패:', error);
      }
    );
  }, [gltfLoader, ktx2]);

  // 모델 로딩 완료 시 초기 설정
  useEffect(() => {
    if (scene && modelRef.current) {
      // 모델 스케일과 위치, 회전 조정
      modelRef.current.scale.set(...scale);
      modelRef.current.position.set(...position);
      modelRef.current.rotation.set(...rotation);
      
      // 모델에 그림자 설정
      scene.traverse((child: THREE.Object3D) => {
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
    }
  }, [scene, position, rotation, scale]);

  if (!scene) {
    return null;
  }

  return (
    <primitive 
      object={scene} 
      ref={modelRef}
      onPointerOver={(e: ThreeEvent<MouseEvent>) => {
           // 이벤트 전파 중단
           e.stopPropagation();
      }}
    />
  );
}
