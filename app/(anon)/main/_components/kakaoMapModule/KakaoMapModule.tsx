'use client';

import React from 'react';
import { useKakaoMap } from '@/(anon)/main/_components/hooks/useKakaoMap';
import {
  Location,
  KakaoMapOptions,
} from '@/(anon)/main/_components/types/map.types';

interface KakaoMapModuleProps extends KakaoMapOptions {
  showTransactionMarkers?: boolean;
  transactionData?: Array<{
    id: string;
    아파트?: string;
    거래금액: string;
    전용면적: string;
    층: string;
    건축년도: string;
    년: string;
    월: string;
    일: string;
    법정동: string;
    지번: string;
    location?: Location;
  }>;
  searchLocationMarker?: Location | null;
  adjustBounds?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const KakaoMapModule: React.FC<KakaoMapModuleProps> = (props) => {
  const {
    mapRef,
    isLoading,
    gpsLoading,
    addressLoading,
    gpsError,
    addressError,
    addressInfo,
    currentLocation,
    refreshLocation,
  } = useKakaoMap(props);

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

      {(isLoading || gpsLoading || addressLoading) && (
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
              {gpsLoading
                ? '위치 정보 가져오는 중...'
                : addressLoading
                ? '주소 정보 가져오는 중...'
                : '지도 로딩 중...'}
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
    </div>
  );
};

export default KakaoMapModule;
