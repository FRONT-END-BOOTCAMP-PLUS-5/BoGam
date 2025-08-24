import { useEffect, useRef, useCallback } from 'react';
import {
  DaumPostcodeData,
  DaumPostcodeSize,
} from '@/(anon)/main/_components/types/mainPage.types';

export const useDaumPostcode = (
  onComplete: (data: DaumPostcodeData) => void,
  setShowPostcode: (show: boolean) => void,
  onError?: (error: string) => void
) => {
  const postcodeRef = useRef<HTMLDivElement>(null);

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Daum Postcode 실행 함수
  const execDaumPostcode = useCallback(() => {
    if (!window.daum) {
      const errorMessage = 'Daum Postcode 스크립트가 로드되지 않았습니다.';
      if (onError) {
        onError(errorMessage);
      } else {
        console.error(errorMessage);
      }
      return;
    }

    // 모달을 먼저 표시
    setShowPostcode(true);

    // 약간의 지연을 두어 DOM이 업데이트된 후 실행
    setTimeout(() => {
      if (postcodeRef.current) {
        new window.daum.Postcode({
          oncomplete: function (data: DaumPostcodeData) {
            onComplete(data);
          },
          onresize: function (size: DaumPostcodeSize) {
            if (postcodeRef.current) {
              postcodeRef.current.style.height = size.height + 'px';
            }
          },
          width: '100%',
          height: '100%',
        }).embed(postcodeRef.current);
      }
    }, 100);
  }, [onComplete, setShowPostcode, onError]);

  return {
    postcodeRef,
    execDaumPostcode,
  };
};
