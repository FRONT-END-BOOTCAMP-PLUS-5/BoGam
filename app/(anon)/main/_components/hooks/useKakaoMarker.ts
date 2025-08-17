import { useKakaoMapMarkers } from './useKakaoMapMarkers';
import { Location } from '@/(anon)/main/_components/types/map.types';

interface UseKakaoMarkerOptions {
  showInfoWindow?: boolean;
  infoWindowContent?: string | ((location: Location) => string);
  markerOptions?: any;
  infoWindowOptions?: any;
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

  const createMarker = (location: Location, map: any) => {
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
  };

  const removeMarker = () => {
    removeMarkerBase('current-location');
  };

  const updateMarkerPosition = (location: Location, map: any) => {
    updateMarkerPositionBase('current-location', location);
  };

  return {
    createMarker,
    removeMarker,
    updateMarkerPosition,
  };
};
