'use client';

import React, { useMemo } from 'react';
import { useKakaoMap } from '@/(anon)/main/_components/hooks/useKakaoMap';
import {
  Location,
  KakaoMapOptions,
} from '@/(anon)/main/_components/types/map.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useLocationManager } from '@/(anon)/main/_components/hooks/useLocationManager';

interface KakaoMapModuleProps {
  showTransactionMarkers?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const KakaoMapModule: React.FC<KakaoMapModuleProps> = (props) => {
  // Store에서 필요한 데이터만 구독
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  const { mapCenter, adjustBounds, searchLocationMarker } = useMapStore();
  const { transactionData } = useTransactionDataStore();
  const { gpsLocation, gpsLoading, currentLocationType } = useLocationManager();

  // 지도 중심점 결정 (mapCenter가 우선, 선택된 주소는 초기값으로만 사용)
  const effectiveMapCenter = useMemo(() => {
    // mapCenter가 설정되어 있으면 우선 사용 (사용자가 버튼을 눌렀을 때)
    if (mapCenter && (mapCenter.lat !== 37.5665 || mapCenter.lng !== 126.978)) {
      console.log('🗺️ 사용자 설정 지도 중심점 사용:', mapCenter);
      return mapCenter;
    }

    // 선택된 주소가 있으면 해당 주소 사용
    if (selectedAddress) {
      // 좌표 유효성 검사
      if (selectedAddress.x === selectedAddress.y && selectedAddress.x !== 0) {
        console.warn('잘못된 주소 좌표:', selectedAddress);
        return mapCenter; // 기본 지도 중심점 사용
      }
      console.log('🗺️ 선택된 주소로 지도 중심점 설정:', {
        lat: selectedAddress.y,
        lng: selectedAddress.x,
      });
      return { lat: selectedAddress.y, lng: selectedAddress.x };
    }

    console.log('🗺️ 기본 지도 중심점 사용:', mapCenter);
    return mapCenter;
  }, [selectedAddress, mapCenter]);

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
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        ...props.style,
      }}
    >
      <div
        ref={mapRef}
        className={`kakao-map ${props.className || ''}`}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ddd',
        }}
      />

      {(isLoading || mapGpsLoading || addressLoading) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(245, 245, 245, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>
              {mapGpsLoading
                ? '위치 정보 가져오는 중...'
                : addressLoading
                ? '주소 정보 가져오는 중...'
                : isLoading
                ? '지도 로딩 중...'
                : '지도 초기화 중...'}
            </p>
            {currentLocation && (
              <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                현재 위치: {currentLocation.lat.toFixed(6)},{' '}
                {currentLocation.lng.toFixed(6)}
              </p>
            )}
            {addressInfo && (
              <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                주소: {addressInfo.address.address_name}
              </p>
            )}
            {gpsError && (
              <p
                style={{
                  margin: '5px 0 0 0',
                  fontSize: '12px',
                  color: '#ff6b6b',
                }}
              >
                GPS 오류: {gpsError}
              </p>
            )}
            {addressError && (
              <p
                style={{
                  margin: '5px 0 0 0',
                  fontSize: '12px',
                  color: '#ff6b6b',
                }}
              >
                주소 오류: {addressError}
              </p>
            )}
            <button
              onClick={refreshLocation}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              위치 새로고침
            </button>
          </div>
        </div>
      )}

      {/* API 키 오류 메시지 */}
      {!isLoading && !mapGpsLoading && !addressLoading && gpsError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>
              지도를 불러올 수 없습니다
            </h3>
            <p
              style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}
            >
              {gpsError}
            </p>
            <button
              onClick={refreshLocation}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
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
