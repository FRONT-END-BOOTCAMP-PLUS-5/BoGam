import { useState, useEffect } from 'react';

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

  const mergedOptions = { ...defaultOptions, ...options };

  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('브라우저가 GPS를 지원하지 않습니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('GPS 위치 정보 가져오기 실패:', error);
          let errorMessage = 'GPS 위치 정보를 가져올 수 없습니다.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 접근이 거부되었습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: mergedOptions.enableHighAccuracy,
          timeout: mergedOptions.timeout,
          maximumAge: mergedOptions.maximumAge,
        }
      );
    });
  };

  const refreshLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const location = await getCurrentLocation();
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
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return {
    ...state,
    refreshLocation,
  };
};
