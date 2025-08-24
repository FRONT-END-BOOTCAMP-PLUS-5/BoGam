export const styles = {
  // 컨테이너
  container: 'w-full flex flex-col gap-8',

  // 안내 메시지
  instructionContainer: 'flex justify-center w-full',
  instruction: 'text-lg font-semibold text-brand-black',

  // 주소 표시
  addressContainer: 'flex justify-center h-12 w-full p-3 bg-brand-light-blue rounded-lg',
  addressValue: 'flex items-center text-sm text-brand-black',

  // 폼 요소들
  label: 'text-sm font-medium text-brand-dark-gray',
  select:
    'w-full px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',

  // 단지명 입력 그룹
  complexInputGroup: 'flex gap-2',
  complexText: 'flex-1 px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-light-gray text-brand-black',
  complexInput:
    'flex-1 px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',
  fetchButton: '!mt-0 w-[40%]',

  // 실거래가 조회 버튼
  searchButtonContainer: 'flex justify-center w-full',
  searchButton: '!mt-0 w-full',

  // 개별 섹션 컨테이너들
  yearContainer: 'flex flex-col justify-center w-full',
  buildingTypeContainer: 'flex flex-col justify-center w-full',
  complexContainer: 'flex flex-col justify-center w-full',
} as const;
