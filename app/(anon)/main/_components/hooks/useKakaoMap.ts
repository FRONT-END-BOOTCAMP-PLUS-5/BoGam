import { useCallback, useEffect, useRef, useState } from 'react';
import { useGeolocation } from './useGeolocation';
import { useKakaoMarker } from './useKakaoMarker';
import { useKakaoMapMarkers } from './useKakaoMapMarkers';
import { useAddressInfo } from './useAddressInfo';
import { useMapStore } from '@libs/stores/map/mapStore';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';

import {
  Location as MapLocation,
  KakaoMapOptions,
} from '@/(anon)/main/_components/types/map.types';

interface KakaoMapHookProps extends KakaoMapOptions {
  showTransactionMarkers?: boolean;
}

export const useKakaoMap = (props: KakaoMapHookProps) => {
  const {
    center,
    level = 3,
    useGPSFirst = true,
    showCurrentLocationMarker = true,
    showAddressInfo = true,
    markerOptions = {},
  } = props;

  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  // Store에서 데이터 가져오기
  const { searchLocationMarker, adjustBounds } = useMapStore();
  const { transactionData } = useTransactionDataStore();

  // 모든 마커가 보이도록 지도 영역 조정 함수
  const handleAdjustMapBounds = useCallback(
    (markersData: Array<{ location: MapLocation }>) => {
      if (!mapInstanceRef.current || !window.kakao?.maps) {
        console.warn('지도 인스턴스 또는 카카오맵 SDK가 없습니다.');
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bounds = new (window.kakao.maps as any).LatLngBounds();

        // 모든 마커의 위치를 경계에 추가
        markersData.forEach(({ location }) => {
          if (isValidLocation(location)) {
            bounds.extend(
              new window.kakao.maps.LatLng(location.lat, location.lng)
            );
          }
        });

        // 검색 위치 마커가 있으면 추가
        if (searchLocationMarker && isValidLocation(searchLocationMarker)) {
          bounds.extend(
            new window.kakao.maps.LatLng(
              searchLocationMarker.lat,
              searchLocationMarker.lng
            )
          );
        }

        // 경계가 유효한 경우에만 지도 경계 설정
        if (!bounds.isEmpty()) {
          mapInstanceRef.current.setBounds(bounds);
        }
      } catch (error) {
        console.error('지도 경계 조정 실패:', error);
      }
    },
    [searchLocationMarker]
  );

  // 위치 정보가 유효한지 확인하는 함수
  const isValidLocation = (location: MapLocation): boolean => {
    return (
      location &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      !isNaN(location.lat) &&
      !isNaN(location.lng) &&
      location.lat !== 0 &&
      location.lng !== 0
    );
  };

  // GPS 위치 정보 hook 사용
  const {
    location: gpsLocation,
    loading: gpsLoading,
    error: gpsError,
    refreshLocation,
  } = useGeolocation();

  // 주소 정보 hook 사용
  const {
    addressInfo,
    loading: addressLoading,
    error: addressError,
    getAddressInfo,
    clearAddressInfo,
  } = useAddressInfo();

  // 마커 hook 사용
  const { createMarker, removeMarker, updateMarkerPosition } = useKakaoMarker({
    showInfoWindow: markerOptions.showInfoWindow ?? true,
    infoWindowContent: markerOptions.infoWindowContent,
    markerOptions: markerOptions.markerOptions,
    infoWindowOptions: markerOptions.infoWindowOptions,
  });

  // 실거래가 마커 hook 사용
  const { createMultipleMarkers, removeAllMarkers } = useKakaoMapMarkers({
    showInfoWindow: true,
    markerOptions: {
      title: '부동산 거래',
      clickable: true,
      draggable: false,
      zIndex: 2,
    },
    infoWindowOptions: {
      removable: true,
      zIndex: 1,
    },
  });

  // 검색한 주소 마커 hook 사용
  const { createMarker: createSearchMarker, removeMarker: removeSearchMarker } =
    useKakaoMarker({
      showInfoWindow: true,
      infoWindowContent: '검색한 주소',
      markerOptions: {
        title: '검색한 주소',
        clickable: true,
        draggable: false,
        zIndex: 3,
      },
      infoWindowOptions: {
        removable: true,
        zIndex: 1,
      },
    });

  // 위치 설정 로직
  useEffect(() => {
    console.log('🗺️ useKakaoMap 위치 설정 로직:', {
      useGPSFirst,
      gpsLoading,
      gpsError,
      gpsLocation,
      center,
      currentLocation,
    });

    if (useGPSFirst) {
      if (gpsLoading) return;
      if (gpsError) {
        const fallbackLocation = center || { lat: 37.5665, lng: 126.978 };
        console.log('🗺️ GPS 오류 - fallback 위치 사용:', fallbackLocation);
        setCurrentLocation(fallbackLocation);
        return;
      }
      if (gpsLocation) {
        console.log('🗺️ GPS 위치 설정:', gpsLocation);
        setCurrentLocation(gpsLocation);
        return;
      }
      const fallbackLocation = center || { lat: 37.5665, lng: 126.978 };
      console.log('🗺️ GPS 없음 - fallback 위치 사용:', fallbackLocation);
      setCurrentLocation(fallbackLocation);
    } else {
      if (center) {
        console.log('🗺️ center prop 위치 설정:', center);
        setCurrentLocation(center);
        return;
      }
      if (gpsError) {
        const fallbackLocation = { lat: 37.5665, lng: 126.978 };
        console.log('🗺️ GPS 오류 - 기본 위치 사용:', fallbackLocation);
        setCurrentLocation(fallbackLocation);
        return;
      }
      if (gpsLocation) {
        console.log('🗺️ GPS 위치 설정 (fallback):', gpsLocation);
        setCurrentLocation(gpsLocation);
        return;
      }
      console.log('🗺️ 기본 위치 설정');
      setCurrentLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, [center, gpsLocation, gpsError, gpsLoading, useGPSFirst]);

  // center prop이 변경될 때 지도 중심 이동
  useEffect(() => {
    if (mapInstanceRef.current && center && window.kakao && window.kakao.maps) {
      console.log('지도 중심 이동:', center);
      try {
        const position = new window.kakao.maps.LatLng(center.lat, center.lng);
        mapInstanceRef.current.setCenter(position);
        console.log('지도 중심 이동 완료');
      } catch (error) {
        console.error('지도 중심 이동 실패:', error);
      }
    }
  }, [center]);

  // 현재 위치가 변경될 때 주소 정보 가져오기
  useEffect(() => {
    if (currentLocation && showAddressInfo) {
      getAddressInfo(currentLocation);
    } else {
      clearAddressInfo();
    }
  }, [currentLocation, showAddressInfo, getAddressInfo, clearAddressInfo]);

  // 지도 초기화
  useEffect(() => {
    if (!currentLocation) return;

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!apiKey) {
      console.error(
        '카카오맵 API 키가 설정되지 않았습니다. NEXT_PUBLIC_KAKAO_MAP_API_KEY 환경 변수를 설정해주세요.'
      );
      setIsLoading(false);
      return;
    }

    const initMap = () => {
      if (!mapRef.current) {
        setIsLoading(false);
        return;
      }

      // Kakao Maps API가 완전히 로드되었는지 확인
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
        console.warn('Kakao Maps API가 아직 로드되지 않았습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const options = {
          center: new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          ),
          level: level,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        mapInstanceRef.current = map;
        setIsLoading(false);

        if (showCurrentLocationMarker) {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createMarker(currentLocation, map as any);
          }, 100);
        }
      } catch (err) {
        console.error('지도 초기화 실패:', err);
        setIsLoading(false);
      }
    };

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );

    if (existingScript) {
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        initMap();
      } else {
        console.log('Kakao Maps API 로드 대기 중...');
        // API가 로드될 때까지 대기
        const checkKakaoMaps = () => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
            initMap();
          } else {
            setTimeout(checkKakaoMaps, 100);
          }
        };
        checkKakaoMaps();
      }
    } else {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          // API 로드 완료 후 약간의 지연을 두고 초기화
          setTimeout(() => {
            if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
              initMap();
            } else {
              console.error(
                'Kakao Maps API 로드 후에도 LatLng를 찾을 수 없습니다.'
              );
              setIsLoading(false);
            }
          }, 100);
        });
      };

      script.onerror = () => {
        console.error('카카오맵 스크립트 로드 실패');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    }
  }, [currentLocation, level, showCurrentLocationMarker]);

  // 현재 위치가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (
      mapInstanceRef.current &&
      currentLocation &&
      showCurrentLocationMarker
    ) {
      updateMarkerPosition(currentLocation, mapInstanceRef.current);
    }
  }, [currentLocation, showCurrentLocationMarker, updateMarkerPosition]);

  // 실거래가 데이터가 있을 때 마커 생성
  useEffect(() => {
    if (mapInstanceRef.current && transactionData.length > 0) {
      removeAllMarkers();

      const markersData = transactionData
        .filter((item) => item.location)
        .map((item, index) => ({
          id: `transaction-${index}`,
          location: item.location!,
          title: item.아파트 || '부동산',
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #333;">
                ${item.아파트 || '부동산'}
              </div>
              <div style="font-size: 12px; color: #666; line-height: 1.4;">
                <div>거래금액: ${item.거래금액}</div>
                <div>면적: ${item.전용면적}㎡</div>
                <div>층수: ${item.층}층</div>
                <div>건축년도: ${item.건축년도}년</div>
                <div>거래일: ${item.년}년 ${item.월}월 ${item.일}일</div>
                <div>주소: ${item.법정동} ${item.지번}</div>
              </div>
            </div>
          `,
        }));

      createMultipleMarkers(markersData, mapInstanceRef.current);

      if (adjustBounds && markersData.length > 0) {
        setTimeout(() => {
          handleAdjustMapBounds(markersData);
        }, 500);
      }
    }
  }, [
    transactionData,
    adjustBounds,
    searchLocationMarker,
    removeAllMarkers,
    createMultipleMarkers,
    handleAdjustMapBounds,
  ]);

  // 검색한 주소 마커 관리
  useEffect(() => {
    if (mapInstanceRef.current && searchLocationMarker) {
      createSearchMarker(searchLocationMarker, mapInstanceRef.current);
    } else if (mapInstanceRef.current && !searchLocationMarker) {
      removeSearchMarker();
    }
  }, [searchLocationMarker, createSearchMarker, removeSearchMarker]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      removeMarker();
      removeAllMarkers();
    };
  }, [removeMarker, removeAllMarkers]);

  return {
    mapRef,
    isLoading,
    gpsLoading,
    addressLoading,
    gpsError,
    addressError,
    addressInfo,
    currentLocation,
    refreshLocation,
  };
};
