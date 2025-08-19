import { create } from 'zustand';
import { Location } from '@/(anon)/main/_components/types/map.types';

interface MapStore {
  // 지도 상태
  mapCenter: Location;
  searchLocationMarker: Location | null;
  adjustBounds: boolean;

  // 지도 액션
  setMapCenter: (location: Location) => void;
  setSearchLocationMarker: (location: Location | null) => void;
  setAdjustBounds: (adjust: boolean) => void;

  // 지도 초기화
  resetMap: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  // 초기 상태
  mapCenter: { lat: 37.5665, lng: 126.978 }, // 서울 시청
  searchLocationMarker: null,
  adjustBounds: true,

  // 지도 액션
  setMapCenter: (location) => {
    set({ mapCenter: location });
    console.log('🗺️ 지도 중심점 설정:', location);
  },

  setSearchLocationMarker: (location) => {
    set({ searchLocationMarker: location });
    console.log('📍 검색 위치 마커 설정:', location);
  },

  setAdjustBounds: (adjust) => {
    set({ adjustBounds: adjust });
    console.log('🔧 지도 경계 조정 설정:', adjust);
  },

  // 지도 초기화
  resetMap: () => {
    set({
      mapCenter: { lat: 37.5665, lng: 126.978 },
      searchLocationMarker: null,
      adjustBounds: true,
    });
    console.log('🔄 지도 상태 초기화');
  },
}));
