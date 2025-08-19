import { useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useUserAddresses } from '@libs/stores/userAddresses/useUserAddresses';

export const useLocationManager = () => {
  // Store에서 데이터 가져오기
  const { userAddresses, selectedAddress, selectAddress } =
    useUserAddressStore();
  const { setMapCenter } = useMapStore();
  const { isAuthenticated } = useUserAddresses();

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
    console.log('useLocationManager - 위치 설정 로직 실행:', {
      isAuthenticated,
      userAddressesLength: userAddresses.length,
      userAddresses: userAddresses,
      primaryAddress: userAddresses.find((addr) => addr.isPrimary),
      gpsLocation,
    });

    // 로그인되어 있고 사용자 주소가 있는 경우
    if (isAuthenticated && userAddresses.length > 0) {
      // 대표 주소 또는 첫 번째 주소 선택
      const targetAddress =
        userAddresses.find((addr) => addr.isPrimary) || userAddresses[0];

      console.log('사용자 주소 선택:', targetAddress);
      if (targetAddress) {
        // 좌표 유효성 검사
        if (targetAddress.x === targetAddress.y && targetAddress.x !== 0) {
          console.warn(
            '잘못된 주소 좌표로 인해 GPS 위치를 사용합니다:',
            targetAddress
          );
          // 잘못된 좌표가 있으면 GPS 위치 사용
          if (gpsLocation) {
            setMapCenter(gpsLocation);
          }
          return;
        }

        // Store의 selectAddress만 사용 (지도 중심점은 자동 설정하지 않음)
        selectAddress(targetAddress);

        // 대표 주소가 변경된 경우 지도 중심점도 업데이트
        if (targetAddress.isPrimary) {
          setMapCenter({ lat: targetAddress.y, lng: targetAddress.x });
          console.log('🗺️ 대표 주소 변경으로 지도 중심점 업데이트:', {
            lat: targetAddress.y,
            lng: targetAddress.x,
          });
        }
        // 지도 중심점은 사용자가 명시적으로 요청할 때만 설정
      }
    }
  }, [
    isAuthenticated,
    userAddresses.length,
    userAddresses.find((addr) => addr.isPrimary)?.id, // 대표 주소 ID 변경 감지
    gpsLocation,
    selectAddress,
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
