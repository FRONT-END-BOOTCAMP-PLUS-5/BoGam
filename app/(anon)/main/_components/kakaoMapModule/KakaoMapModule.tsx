'use client';

import React, { useMemo } from 'react';
import { useKakaoMap } from '@/hooks/main/useKakaoMap';
import { KakaoMapOptions } from '@/(anon)/main/_components/types/map.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useLocationManager } from '@/hooks/main/useLocationManager';
import { styles } from './KakaoMapModule.styles';

interface KakaoMapModuleProps {
  showTransactionMarkers?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const KakaoMapModule: React.FC<KakaoMapModuleProps> = (props) => {
  // Store에서 필요한 데이터만 구독
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  const { mapCenter } = useMapStore();
  const { gpsLocation, currentLocationType } = useLocationManager();

  // 지도 중심점 결정 (위치 타입에 따라 결정)
  const effectiveMapCenter = useMemo(() => {
    // GPS 모드인 경우 GPS 위치 우선 사용
    if (currentLocationType === 'gps') {
      if (gpsLocation) {
        return gpsLocation;
      }

      return { lat: 37.5665, lng: 126.978 };
    }

    // 사용자 주소 모드인 경우
    if (currentLocationType === 'user-address') {
      // mapCenter가 명시적으로 설정된 경우 (사용자가 버튼을 눌렀을 때)
      if (
        mapCenter &&
        (mapCenter.lat !== 37.5665 || mapCenter.lng !== 126.978)
      ) {
        return mapCenter;
      }

      // 선택된 주소가 있으면 해당 주소 사용
      if (selectedAddress) {
        // 좌표 유효성 검사
        if (
          selectedAddress.x === selectedAddress.y &&
          selectedAddress.x !== 0
        ) {
          console.warn('잘못된 주소 좌표:', selectedAddress);
          return { lat: 37.5665, lng: 126.978 }; // 기본 위치 사용
        }

        return { lat: selectedAddress.y, lng: selectedAddress.x };
      }
    }

    return { lat: 37.5665, lng: 126.978 };
  }, [currentLocationType, selectedAddress, mapCenter, gpsLocation]);

  // KakaoMap 옵션
  const mapOptions: KakaoMapOptions = {
    center: effectiveMapCenter,
    level: 3,
    useGPSFirst: currentLocationType === 'gps',
    showCurrentLocationMarker: currentLocationType === 'gps',
    showAddressInfo: false,
  };
  const {
    mapRef,
    isLoading,
    gpsLoading: mapGpsLoading,
    addressLoading,
    gpsError,
    addressError,
    addressInfo,
    currentLocation,
    refreshLocation,
  } = useKakaoMap(mapOptions);

  return (
    <div className={styles.mainContainer} style={props.style}>
      <div
        ref={mapRef}
        className={`kakao-map ${props.className || ''} ${styles.map}`}
      />

      {(isLoading || mapGpsLoading || addressLoading) && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <p className={styles.loadingText}>
              {mapGpsLoading
                ? '위치 정보 가져오는 중...'
                : addressLoading
                ? '주소 정보 가져오는 중...'
                : isLoading
                ? '지도 로딩 중...'
                : '지도 초기화 중...'}
            </p>
            {currentLocation && (
              <p className={styles.locationText}>
                현재 위치: {currentLocation.lat.toFixed(6)},{' '}
                {currentLocation.lng.toFixed(6)}
              </p>
            )}
            {addressInfo && (
              <p className={styles.locationText}>
                주소: {addressInfo.address.address_name}
              </p>
            )}
            {gpsError && (
              <p className={styles.errorText}>
                GPS 오류: {gpsError}
              </p>
            )}
            {addressError && (
              <p className={styles.errorText}>
                주소 오류: {addressError}
              </p>
            )}
            <button
              onClick={refreshLocation}
              className={styles.refreshButton}
            >
              위치 새로고침
            </button>
          </div>
        </div>
      )}

      {/* API 키 오류 메시지 */}
      {!isLoading && !mapGpsLoading && !addressLoading && gpsError && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>
              지도를 불러올 수 없습니다
            </h3>
            <p className={styles.errorDescription}>
              {gpsError}
            </p>
            <button
              onClick={refreshLocation}
              className={styles.retryButton}
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMapModule;
