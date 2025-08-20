export const styles = {
  // 컨테이너
  container: 'max-w-4xl mx-auto space-y-6 h-full flex flex-col p-4',

  // 하단 섹션
  bottomSection:
    'bg-brand-white rounded-lg shadow-lg p-6 space-y-6 flex-1 overflow-y-auto min-h-0',

  // 지도 헤더
  mapHeader: 'flex items-center gap-2 mb-4',
  mapIcon: 'text-xl',
  mapTitle: 'text-lg font-semibold text-brand-black',

  // 위치 상태 표시
  locationStatus: 'ml-auto text-xs',
  locationLoading: 'text-brand-blue',
  locationError: 'text-brand-red',
  locationGPS: 'text-brand-green',
  locationUser: 'text-brand-purple',

  // 검색 가이드
  searchGuide:
    'text-xs text-brand-dark-gray mb-4 p-3 bg-brand-light-blue rounded-lg',

  // 지도 컨테이너
  mapContainer:
    'h-80 rounded-lg overflow-hidden border border-brand-light-gray',
} as const;
