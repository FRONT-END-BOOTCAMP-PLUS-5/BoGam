export const styles = {
  // 검색 컨테이너
  searchContainer: 'bg-white rounded-lg shadow-lg p-6 space-y-4',

  // 검색 행
  searchRow: 'flex gap-3 items-center',
  searchInput:
    'flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  searchButton:
    'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium',

  // 주소 상세 행
  addressDetailRow: 'space-y-4',
  addressInfo: 'flex items-center gap-2',
  addressLabel: 'text-sm font-medium text-gray-700',
  addressValue: 'text-sm text-gray-900',

  // 건물 정보 컨테이너
  buildingInfoContainer: 'space-y-3',
  buildingTypeContainer: 'flex items-center gap-3',
  buildingTypeLabel: 'text-sm font-medium text-gray-700 whitespace-nowrap',
  buildingTypeSelect:
    'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',

  // 동/호 입력
  dongHoInput: 'space-y-3',
  dongHoRow: 'flex items-center gap-2',
  dongField:
    'w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
  hoField:
    'w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
  dongHoSeparator: 'text-sm text-gray-600 whitespace-nowrap',

  // 버튼 행
  buttonRow: 'flex gap-3 flex-wrap',
  moveButtonOnly:
    'px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium',
  moveButton:
    'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium',

  // 날짜 컨테이너
  dateContainer: 'flex items-center gap-3 p-4 bg-gray-50 rounded-lg',
  dateLabel: 'text-sm font-medium text-gray-700 whitespace-nowrap',
  dateSelect:
    'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm',
} as const;
