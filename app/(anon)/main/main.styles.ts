export const styles = {
  // 컨테이너
  containerMobile: 'min-h-screen bg-brand-gray px-4 py-6',
  container: 'max-w-4xl mx-auto space-y-6',

  // 하단 섹션
  bottomSection: 'bg-brand-white rounded-lg shadow-lg p-6 space-y-4',

  // 지도 헤더
  mapHeader: 'flex items-center gap-2 mb-4',
  mapIcon: 'text-2xl',
  mapTitle: 'text-xl font-semibold text-brand-black',

  // 위치 상태 표시
  locationStatus: 'ml-auto text-sm',
  locationLoading: 'text-brand-blue',
  locationError: 'text-brand-red',
  locationGPS: 'text-brand-green',
  locationUser: 'text-brand-purple',

  // 검색 가이드
  searchGuide:
    'text-sm text-brand-dark-gray mb-4 p-3 bg-brand-light-blue rounded-lg',

  // 지도 컨테이너
  mapContainer:
    'h-96 rounded-lg overflow-hidden border border-brand-light-gray',
} as const;
