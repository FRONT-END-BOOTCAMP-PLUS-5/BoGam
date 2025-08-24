export const styles = {
  // 검색 컨테이너
  searchContainer: 'bg-brand-white rounded-lg shadow-lg p-6 space-y-4',

  // 검색 행
  searchRow: 'flex gap-3 items-center',
  searchInput:
    'flex-1 px-4 py-3 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
  searchButton:
    'px-4 py-2 bg-brand text-brand-white rounded-lg hover:bg-brand transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed text-sm font-medium',

  // 주소 상세 행
  addressDetailRow: 'space-y-4',
  addressInfo: 'flex items-center gap-2',
  addressLabel: 'text-sm font-medium text-brand-dark-gray',
  addressValue: 'text-sm text-brand-black',

  // 건물 정보 컨테이너
  buildingInfoContainer: 'space-y-3',
  buildingTypeContainer: 'flex items-center gap-3',
  buildingTypeLabel:
    'text-sm font-medium text-brand-dark-gray whitespace-nowrap',
  buildingTypeSelect:
    'flex-1 px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand',

  // 동/호 입력
  dongHoInput: 'space-y-3',
  dongHoRow: 'flex items-center gap-2',
  dongField:
    'w-20 px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand',
  hoField:
    'w-20 px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand',
  dongHoSeparator: 'text-sm text-brand-dark-gray whitespace-nowrap',

  // 버튼 행
  buttonRow: 'flex gap-3 flex-wrap',
  moveButtonOnly:
    'px-4 py-2 bg-brand text-brand-white rounded-lg hover:bg-brand-90 transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed text-sm font-medium',
  moveButton:
    'px-4 py-2 bg-brand-green text-brand-white rounded-lg hover:bg-brand-green/90 transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed text-sm font-medium',
  saveButton:
    'px-4 py-2 bg-brand-purple text-brand-white rounded-lg hover:bg-brand-purple/90 transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed text-sm font-medium',

  // 날짜 컨테이너
  dateContainer: 'flex items-center gap-3 p-4 bg-brand-light-blue rounded-lg',
  dateLabel: 'text-sm font-medium text-brand-dark-gray whitespace-nowrap',
  dateSelect:
    'px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm',
} as const;
