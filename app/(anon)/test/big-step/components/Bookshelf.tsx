import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';

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
  });
};
