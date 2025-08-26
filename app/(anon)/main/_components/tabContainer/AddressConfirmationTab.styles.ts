export const styles = {
  // 컨테이너 - 4개 요소를 세로로 배치
  container: 'w-full flex flex-col gap-3',

  // 첫 번째 줄: 버튼들
  buttonRow: 'flex flex-row items-center gap-2',

  // 두 번째 줄: 주소 검색 결과
  addressContainer:
    'flex justify-flex-start w-full h-12 py-3 bg-white rounded-lg',
  addressValue: 'flex text-sm text-brand-black ',
  addressPlaceholder: 'flex text-sm text-bsrand-dark-gray items-start mt-1',
  addressSearchRow: 'flex gap-1',

  // 세 번째 줄: 동/호 입력 필드들
  dongHoInputs: 'flex flex-row w-full gap-3',

  // 주소 검색 행
  searchButton: '!mt-0 w-[40%] px-0 py-0',

  // 동/호 입력 필드
  dongField: 'w-10 !h-10',
  hoField: 'w-10 !h-10',

  // 버튼 행
  confirmButton: '!mt-0 w-auto px-3 !py-2 !h-auto text-xs rounded shadow-sm',
  saveButton: '!mt-0 w-full px-2 py-1 text-xs',

  // 동/호 입력 컨테이너
  dongHoContainer: 'flex items-center gap-1',
  dongHoLabel: 'text-sm text-brand-dark-gray',

  // 지도 컨테이너
  mapContainer: 'w-full',
  mapWrapper: 'relative',
  mapButtonContainer: 'absolute top-4 left-4 z-10',
} as const;
