import { useCallback, useState, useEffect, useMemo } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackLocation?: Location;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5분
  fallbackLocation: { lat: 37.5665, lng: 126.978 }, // 서울 시청
};

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  // useMemo를 사용하여 mergedOptions를 메모이제이션
  const mergedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [
      options.enableHighAccuracy,
      options.timeout,
      options.maximumAge,
      options.fallbackLocation,
    ]
  );

  const refreshLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const location = await getCurrentLocation(mergedOptions);
      setState({
        location,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      setState({
        location: mergedOptions.fallbackLocation || null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      });
    }
  }, [mergedOptions]);

  // 현재 위치를 가져오는 함수
  const getCurrentLocation = async (
    options: PositionOptions = {}
  ): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('이 브라우저에서는 Geolocation을 지원하지 않습니다.'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      };

      const mergedOptions = { ...defaultOptions, ...options };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(getGeolocationErrorMessage(error)));
        },
        mergedOptions
      );
    });
  };

  // Geolocation 에러 메시지를 가져오는 함수
  const getGeolocationErrorMessage = (
    error: GeolocationPositionError
  ): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return '위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 정보 접근을 허용해주세요.';
      case error.POSITION_UNAVAILABLE:
        return '위치 정보를 사용할 수 없습니다.';
      case error.TIMEOUT:
        return '위치 정보 요청 시간이 초과되었습니다.';
      default:
        return '위치 정보를 가져오는 중 오류가 발생했습니다.';
    }
  };

  // 초기 로드 시에만 실행 (무한 루프 방지)
  useEffect(() => {
    refreshLocation();
  }, []); // 빈 의존성 배열로 초기 로드 시에만 실행

  return {
    ...state,
    refreshLocation,
  };
};
