export const styles = {
  // 컨테이너
  container: 'relative max-w-4xl mx-auto space-y-6 h-full flex flex-col p-4',

  // 하단 섹션
  bottomSection:
    'bg-brand-white rounded-lg shadow-lg p-6 space-y-3 flex-1 overflow-y-auto min-h-0',

  // 지도 헤더
  mapHeader: 'flex items-center gap-2 mb-4',
  mapIcon: 'text-brand',
  mapTitle: 'text-lg font-semibold text-brand-black',

  // 위치 상태 표시
  locationStatus: 'ml-auto text-xs',
  locationLoading: 'text-brand-blue',
  locationError: 'text-brand-error flex flex-row items-center gap-1',
  locationGPS: 'text-brand-green flex flex-row items-center gap-1',
  locationUser: 'text-brand-gold flex flex-row items-center gap-1',

  // 검색 가이드
  searchGuide:
    'text-brand-dark-gray mb-3 text-sm',

  // 지도 컨테이너
  mapContainer:
    'h-80 rounded-lg overflow-hidden border border-brand-light-gray',
  
  //  버튼 영역
  buttonArea: 'h-12 -mt-6',
} as const;

