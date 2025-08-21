import { useCallback } from 'react';
import { useKakaoMapMarkers } from './useKakaoMapMarkers';
import { Location } from '@/(anon)/main/_components/types/map.types';

interface UseKakaoMarkerOptions {
  showInfoWindow?: boolean;
  infoWindowContent?: string | ((location: Location) => string);
  markerOptions?: Record<string, unknown>;
  infoWindowOptions?: Record<string, unknown>;
}

export const useKakaoMarker = (options: UseKakaoMarkerOptions = {}) => {
  const {
    showInfoWindow = true,
    infoWindowContent,
    markerOptions = {},
    infoWindowOptions = {},
  } = options;

  const {
    createMarker: createMarkerBase,
    removeMarker: removeMarkerBase,
    updateMarkerPosition: updateMarkerPositionBase,
  } = useKakaoMapMarkers({
    showInfoWindow,
    markerOptions,
    infoWindowOptions,
  });

  const createMarker = useCallback(
    (location: Location, map: Record<string, unknown>) => {
      const content =
        typeof infoWindowContent === 'function'
          ? infoWindowContent(location)
          : infoWindowContent ||
            `
            <div style="padding: 10px; text-align: center;">
              <div style="font-weight: bold; margin-bottom: 5px;">현재 위치</div>
              <div style="font-size: 12px; color: #666;">
                위도: ${location.lat.toFixed(6)}<br>
                경도: ${location.lng.toFixed(6)}
              </div>
            </div>
          `;

      return createMarkerBase(
        'current-location',
        location,
        map,
        '현재 위치',
        content
      );
    },
    [createMarkerBase, infoWindowContent]
  );

  const removeMarker = useCallback(() => {
    removeMarkerBase('current-location');
  }, [removeMarkerBase]);

  const updateMarkerPosition = useCallback(
    (location: Location, _map: Record<string, unknown>) => {
      updateMarkerPositionBase('current-location', location);
    },
    [updateMarkerPositionBase]
  );

  return {
    createMarker,
    removeMarker,
    updateMarkerPosition,
  };
};
