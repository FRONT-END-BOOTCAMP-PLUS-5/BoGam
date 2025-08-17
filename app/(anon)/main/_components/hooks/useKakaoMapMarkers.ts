import { useRef, useCallback } from 'react';
import {
  Location,
  MarkerData,
} from '@/(anon)/main/_components/types/map.types';

interface MarkerOptions {
  title?: string;
  clickable?: boolean;
  draggable?: boolean;
  zIndex?: number;
}

interface InfoWindowOptions {
  removable?: boolean;
  zIndex?: number;
}

interface UseKakaoMapMarkersOptions {
  showInfoWindow?: boolean;
  markerOptions?: MarkerOptions;
  infoWindowOptions?: InfoWindowOptions;
}

export const useKakaoMapMarkers = (options: UseKakaoMapMarkersOptions = {}) => {
  const {
    showInfoWindow = true,
    markerOptions = {},
    infoWindowOptions = {},
  } = options;

  const markersRef = useRef<Map<string, any>>(new Map());
  const infoWindowsRef = useRef<Map<string, any>>(new Map());

  const createMarker = useCallback(
    (
      id: string,
      location: Location,
      map: any,
      title?: string,
      content?: string
    ) => {
      console.log('createMarker 호출됨:', { id, location, title });

      if (!window.kakao?.maps) {
        console.warn('카카오 맵 SDK가 로드되지 않았습니다.');
        return null;
      }

      // 기존 마커가 있으면 제거
      removeMarker(id);

      const position = new window.kakao.maps.LatLng(location.lat, location.lng);
      console.log('마커 위치:', position);

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: title || markerOptions.title,
        clickable: markerOptions.clickable ?? true,
        draggable: markerOptions.draggable ?? false,
        zIndex: markerOptions.zIndex ?? 1,
      });

      console.log('마커 생성 완료:', marker);
      markersRef.current.set(id, marker);

      // 인포윈도우 생성
      if (showInfoWindow && content) {
        const infoWindow = new window.kakao.maps.InfoWindow({
          content,
          removable: infoWindowOptions.removable ?? true,
          zIndex: infoWindowOptions.zIndex ?? 1,
        });

        infoWindowsRef.current.set(id, infoWindow);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
        });
      }

      return marker;
    },
    [showInfoWindow, markerOptions, infoWindowOptions]
  );

  const createMultipleMarkers = useCallback(
    (markersData: MarkerData[], map: any) => {
      console.log('createMultipleMarkers 호출됨:', markersData);
      markersData.forEach(({ id, location, title, content }) => {
        console.log('마커 생성:', { id, location, title });
        createMarker(id, location, map, title, content);
      });
    },
    [createMarker]
  );

  const removeMarker = useCallback((id: string) => {
    const marker = markersRef.current.get(id);
    const infoWindow = infoWindowsRef.current.get(id);

    if (marker) {
      marker.setMap(null);
      markersRef.current.delete(id);
    }

    if (infoWindow) {
      infoWindow.close();
      infoWindowsRef.current.delete(id);
    }
  }, []);

  const removeAllMarkers = useCallback(() => {
    markersRef.current.forEach((marker, id) => {
      removeMarker(id);
    });
  }, [removeMarker]);

  const updateMarkerPosition = useCallback((id: string, location: Location) => {
    const marker = markersRef.current.get(id);
    if (marker) {
      const position = new window.kakao.maps.LatLng(location.lat, location.lng);
      marker.setPosition(position);
    }
  }, []);

  const getMarker = useCallback((id: string) => {
    return markersRef.current.get(id);
  }, []);

  const getAllMarkers = useCallback(() => {
    return Array.from(markersRef.current.values());
  }, []);

  return {
    createMarker,
    createMultipleMarkers,
    removeMarker,
    removeAllMarkers,
    updateMarkerPosition,
    getMarker,
    getAllMarkers,
  };
};
