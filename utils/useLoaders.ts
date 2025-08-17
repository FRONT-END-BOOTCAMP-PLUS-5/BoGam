import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 전역 싱글톤 로더 인스턴스들
let globalLoaders: { ktx2: KTX2Loader; gltf: GLTFLoader } | null = null;

export function useLoaders() {
  const { gl } = useThree();
  
  const loaders = useMemo(() => {
    // 이미 전역 로더가 있다면 재사용
    if (globalLoaders) {
      return globalLoaders;
    }
    
    // 새로운 로더 인스턴스 생성 (한 번만)
    const ktx2 = new KTX2Loader()
      .setTranscoderPath('/basis/')
      .detectSupport(gl);
    
    // GLTFLoader 생성 및 설정
    const gltf = new GLTFLoader();
    gltf.setKTX2Loader(ktx2);
    
    // 전역 변수에 저장
    globalLoaders = { ktx2, gltf };
    
    return globalLoaders;
  }, [gl]);
  
  return loaders;
}

// 앱 종료 시 모든 로더 정리하는 함수
export function disposeAllLoaders() {
  if (globalLoaders) {
    globalLoaders.ktx2.dispose();
    // GLTFLoader는 dispose 메서드가 없음
    globalLoaders = null;
  }
}
