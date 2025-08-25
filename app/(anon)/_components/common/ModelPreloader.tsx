'use client';

import { useEffect } from 'react';
import axios from 'axios';

interface ModelPreloaderProps {
  onComplete?: () => void;
}

export default function ModelPreloader({ onComplete }: ModelPreloaderProps) {
  useEffect(() => {
    let isMounted = true;

    const preloadModels = async () => {
      try {
        // 이미 다운로드된 파일이 있는지 확인
        if ('caches' in window) {
          const cache = await caches.open('3d-models');
          const cachedModels = await cache.keys();
          const modelUrls = [
            '/models/optimized/book-draco-ktx.glb',
            '/models/optimized/bookshelf-draco-ktx.glb'
          ];
          
          // 이미 모든 모델이 캐시에 있는지 확인
          const allCached = modelUrls.every(url => 
            cachedModels.some(cached => cached.url === window.location.origin + url)
          );
          
          if (allCached) {
            if (isMounted) {
              onComplete?.();
            }
            return;
          }
        }
        
        // 로드할 모델 목록
        const models = [
          '/models/optimized/book-draco-ktx.glb',
          '/models/optimized/bookshelf-draco-ktx.glb'
        ];
        
        // 각 모델을 병렬로 axios로 받아서 캐시에 저장
        const fetchPromises = models.map(async (modelUrl) => {
          if (!isMounted) return null;
          
          try {
            // axios로 파일을 받아서 브라우저 캐시에 저장
            const response = await axios.get(modelUrl, { 
              responseType: 'arraybuffer'
            });
            
            // 파일 내용을 ArrayBuffer로 받아서 캐시에 저장
            const arrayBuffer = response.data as ArrayBuffer;
            
            // 브라우저 캐시에 저장
            if ('caches' in window && isMounted) {
              const cache = await caches.open('3d-models');
              await cache.put(modelUrl, new Response(arrayBuffer));
            }
            
            return { url: modelUrl, data: arrayBuffer };
          } catch (error: unknown) {
            console.error(`❌ ${modelUrl} 다운로드 실패:`, error);
            return null;
          }
        });

        await Promise.all(fetchPromises);
        
        if (isMounted) {
          onComplete?.();
        }
        
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        console.error('3D 모델 파일 다운로드 중 오류 발생:', error);
        if (isMounted) {
          onComplete?.();
        }
      }
    };

    preloadModels();

    // Cleanup 함수
    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  // 화면에 아무것도 표시하지 않음
  return null;
}
