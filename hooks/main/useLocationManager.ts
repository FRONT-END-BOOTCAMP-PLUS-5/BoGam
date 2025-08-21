import { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useLocationManager = () => {
  // Store에서 데이터 가져오기
  const { userAddresses, selectAddress } = useUserAddressStore();

  // 인증 상태는 상위 컴포넌트에서 관리
  const isAuthenticated = true;

  // GPS 위치 정보 관리
  const {
    location: gpsLocation,
    loading: gpsLoading,
    error: gpsError,
    refreshLocation: refreshGPSLocation,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5분
    fallbackLocation: { lat: 37.5665, lng: 126.978 }, // 서울 시청
  });

  // 초기 위치 설정 로직
  useEffect(() => {
    // 로그인되어 있고 사용자 주소가 있는 경우
    if (isAuthenticated && userAddresses.length > 0) {
      // 대표 주소 또는 첫 번째 주소 선택
      const targetAddress =
        userAddresses.find((addr) => addr.isPrimary) || userAddresses[0];

      if (targetAddress) {
        // 좌표 유효성 검사
        if (targetAddress.x === targetAddress.y && targetAddress.x !== 0) {
          // 잘못된 좌표가 있으면 GPS 위치를 사용
          return;
        }

        // Store의 selectAddress만 사용
        selectAddress(targetAddress);
      }
    }
  }, [
    isAuthenticated,
    userAddresses.length,
    userAddresses.find((addr) => addr.isPrimary)?.id, // 대표 주소 ID 변경 감지
  ]);

  return {
    // GPS 관련
    gpsLocation,
    gpsLoading,
    gpsError,
    refreshGPSLocation,

    // 현재 위치 타입
    currentLocationType:
      isAuthenticated && userAddresses.length > 0 ? 'user-address' : 'gps',
  };
};
