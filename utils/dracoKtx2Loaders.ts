import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { WebGLRenderer } from 'three';

// KTX2Loader 싱글톤 인스턴스
let ktx2LoaderInstance: KTX2Loader | null = null;

// DRACOLoader 싱글톤 인스턴스
let dracoLoaderInstance: DRACOLoader | null = null;

/**
 * KTX2Loader 싱글톤 인스턴스를 반환합니다.
 * @param renderer WebGL 렌더러 (KTX2 지원 감지용)
 * @returns KTX2Loader 인스턴스
 */
export const getKTX2Loader = (renderer?: WebGLRenderer): KTX2Loader => {
  if (!ktx2LoaderInstance) {
    ktx2LoaderInstance = new KTX2Loader();
    ktx2LoaderInstance.setTranscoderPath('/basis/');
    ktx2LoaderInstance.setCrossOrigin('anonymous');
    
    if (renderer) {
      ktx2LoaderInstance.detectSupport(renderer);
    }
  }
  
  return ktx2LoaderInstance;
};

/**
 * DRACOLoader 싱글톤 인스턴스를 반환합니다.
 * @returns DRACOLoader 인스턴스
 */
export const getDRACOLoader = (): DRACOLoader => {
  if (!dracoLoaderInstance) {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('/draco/');
  }
  
  return dracoLoaderInstance;
};

/**
 * 모든 로더 인스턴스를 정리합니다.
 * 컴포넌트가 언마운트될 때 호출하여 메모리 누수를 방지합니다.
 */
export const disposeLoaders = (): void => {
  if (ktx2LoaderInstance) {
    ktx2LoaderInstance.dispose();
    ktx2LoaderInstance = null;
  }
  
  if (dracoLoaderInstance) {
    dracoLoaderInstance.dispose();
    dracoLoaderInstance = null;
  }
};
