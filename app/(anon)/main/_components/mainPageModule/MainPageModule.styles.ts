export const styles = {
  // 메인 컨테이너
  container: 'w-full max-w-7xl mx-auto p-4 space-y-6',

  // 하단 섹션
  bottomSection: 'bg-white rounded-lg shadow-lg p-6 space-y-4',

  // 지도 헤더
  mapHeader: 'flex items-center gap-2 mb-4',
  mapIcon: 'text-2xl',
  mapTitle: 'text-xl font-semibold text-gray-800',

  // 검색 가이드
  searchGuide: 'text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg',

  // 지도 컨테이너
  mapContainer: 'h-96 rounded-lg overflow-hidden border border-gray-200',
} as const;
