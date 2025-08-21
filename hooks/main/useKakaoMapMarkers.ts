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

  const markersRef = useRef<Map<string, unknown>>(new Map());
  const infoWindowsRef = useRef<Map<string, unknown>>(new Map());

  const createMarker = useCallback(
    (
      id: string,
      location: Location,
      map: Record<string, unknown>,
      title?: string,
      content?: string
    ) => {
      if (!window.kakao?.maps) {
        console.warn('카카오 맵 SDK가 로드되지 않았습니다.');
        return null;
      }

      // 기존 마커가 있으면 제거
      removeMarker(id);

      const position = new window.kakao.maps.LatLng(location.lat, location.lng);

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: title || markerOptions.title,
        clickable: markerOptions.clickable ?? true,
        draggable: markerOptions.draggable ?? false,
        zIndex: markerOptions.zIndex ?? 1,
      });

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (infoWindow as any).open(map, marker);
        });
      }

      return marker;
    },
    [showInfoWindow, markerOptions, infoWindowOptions]
  );

  const createMultipleMarkers = useCallback(
    (markersData: MarkerData[], map: Record<string, unknown>) => {
      markersData.forEach(({ id, location, title, content }) => {
        createMarker(id, location, map, title, content);
      });
    },
    [createMarker]
  );

  const removeMarker = useCallback((id: string) => {
    const marker = markersRef.current.get(id);
    const infoWindow = infoWindowsRef.current.get(id);

    if (marker) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (marker as any).setMap(null);
      markersRef.current.delete(id);
    }

    if (infoWindow) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (infoWindow as any).close();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (marker as any).setPosition(position);
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
