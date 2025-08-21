import { useMapStore } from '@libs/stores/map/mapStore';
import { useLocationManager } from './useLocationManager';
import { Location } from '@/(anon)/main/_components/types/map.types';
import {
  createLocationFromCoordinates,
  extractLocationFromAddress,
  isValidLocation,
} from '@utils/main/mapUtils';

export const useMapManagement = () => {
  // 지도 관련 Store
  const {
    mapCenter,
    searchLocationMarker,
    adjustBounds,
    setMapCenter,
    setSearchLocationMarker,
    setAdjustBounds,
  } = useMapStore();

  // 위치 관리 (GPS 또는 사용자 주소 기반)
  const {
    gpsLocation,
    gpsLoading,
    gpsError,
    refreshGPSLocation,
    currentLocationType,
  } = useLocationManager();

  // 지도 중심점 설정
  const handleSetMapCenter = (location: Location) => {
    setMapCenter(location);
  };

  // 검색 위치 마커 설정
  const handleSetSearchLocationMarker = (location: Location) => {
    setSearchLocationMarker(location);
  };

  // 지도 경계 조정
  const handleAdjustBounds = (shouldAdjust: boolean) => {
    setAdjustBounds(shouldAdjust);
  };

  // GPS 위치로 지도 이동
  const handleMoveToGPSLocation = () => {
    if (gpsLocation && isValidLocation(gpsLocation)) {
      setMapCenter(gpsLocation);
      setSearchLocationMarker(gpsLocation);
    }
  };

  // 주소로 지도 이동
  const handleMoveToAddress = (address: { x: number; y: number }) => {
    const location = extractLocationFromAddress(address);
    if (location && isValidLocation(location)) {
      setMapCenter(location);
      setSearchLocationMarker(location);
    }
  };

  return {
    // 상태
    mapCenter,
    searchLocationMarker,
    adjustBounds,
    gpsLocation,
    gpsLoading,
    gpsError,
    currentLocationType,

    // 핸들러
    handleSetMapCenter,
    handleSetSearchLocationMarker,
    handleAdjustBounds,
    handleMoveToGPSLocation,
    handleMoveToAddress,

    // 기타
    setMapCenter,
    setSearchLocationMarker,
    setAdjustBounds,
    refreshGPSLocation,
  };
};
