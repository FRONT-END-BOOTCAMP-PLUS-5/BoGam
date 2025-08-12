import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getKTX2Loader, getDRACOLoader } from './dracoKtx2Loaders';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import axios from 'axios';

// 공통 로더 및 설정 (한 번만 생성)
let commonGLTFLoader: GLTFLoader | null = null;
let commonDRACOLoader: any = null;
let commonKTX2Loader: any = null;
let commonTextureLoader: THREE.TextureLoader | null = null;

// 공통 GLTF 로더 초기화 함수 (DRACO, KTX2, Meshopt 포함)
export const initializeCommonGLTFLoader = (renderer?: THREE.WebGLRenderer): GLTFLoader => {
  if (!commonGLTFLoader) {
    commonDRACOLoader = getDRACOLoader();
    commonKTX2Loader = getKTX2Loader(renderer);
    
    commonGLTFLoader = new GLTFLoader();
    commonGLTFLoader.setDRACOLoader(commonDRACOLoader);
    commonGLTFLoader.setKTX2Loader(commonKTX2Loader);
    commonGLTFLoader.setMeshoptDecoder(MeshoptDecoder);
    commonGLTFLoader.setCrossOrigin('anonymous');
    
    console.log('[GLTFTextureLoaders] GLTF 로더 초기화 완료 (DRACO + KTX2 + Meshopt)');
  }
  return commonGLTFLoader;
};

// 공통 텍스처 로더 가져오기
export const getCommonTextureLoader = (): THREE.TextureLoader => {
  if (!commonTextureLoader) {
    commonTextureLoader = new THREE.TextureLoader();
    console.log('[GLTFTextureLoaders] 텍스처 로더 초기화 완료');
  }
  return commonTextureLoader;
};

// 로더 초기화 상태 확인
export const isCommonLoadersInitialized = (): boolean => {
  return commonGLTFLoader !== null && commonTextureLoader !== null;
};

// 캐시 우선 모델 로더 (캐시에 있으면 캐시에서, 없으면 다운로드)
export const loadModelFromCache = async (modelUrl: string): Promise<ArrayBuffer> => {
  // 1. 먼저 브라우저 캐시에서 확인
  if ('caches' in window) {
    try {
      const cache = await caches.open('3d-models');
      const response = await cache.match(modelUrl);
      if (response) {
        console.log(`[Cache] ${modelUrl} 캐시에서 로드`);
        return await response.arrayBuffer();
      }
    } catch (error) {
      console.warn(`[Cache] 캐시 확인 실패:`, error);
    }
  }
  
  // 2. 캐시에 없으면 axios로 다운로드
  console.log(`[Download] ${modelUrl} 새로 다운로드`);
  const response = await axios.get(modelUrl, { responseType: 'arraybuffer' });
  return response.data as ArrayBuffer;
};

// 로더 정리 (메모리 해제 시 사용)
export const cleanupCommonLoaders = (): void => {
  commonGLTFLoader = null;
  commonDRACOLoader = null;
  commonKTX2Loader = null;
  commonTextureLoader = null;
  console.log('[GLTFTextureLoaders] 모든 공통 로더 정리 완료');
};
