export const styles = {
  // 컨테이너
  container: 'w-fit space-y-4',

  // 첫 번째 줄: 버튼들
  buttonRow: 'flex justify-between items-center gap-4',
  actionButtons: 'flex gap-2',

  // 두 번째 줄: 입력 필드들
  inputRow: 'flex gap-4 items-center',
  dongHoInputs: 'flex gap-2',

  // 메인 행 (주소 검색 + 동/호 입력)
  mainRow: 'flex gap-4 items-center',
  searchSection: 'flex gap-2 items-center flex-1',
  dongHoSection: 'flex gap-2 items-center',

  // 주소 검색 행
  searchRow: 'flex gap-2 items-center',
  searchButton:
    'px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 whitespace-nowrap',
  searchInput:
    'w-80 px-4 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',

  // 동/호 입력 행
  dongHoRow: 'flex items-center gap-2',
  dongField:
    'w-20 px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-center',
  hoField:
    'w-20 px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-center',
  dongHoSeparator: 'text-sm text-brand-dark-gray font-medium whitespace-nowrap',

  // 버튼 행
  confirmButton:
    'px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 disabled:bg-brand-light-gray disabled:text-brand-dark-gray disabled:cursor-not-allowed whitespace-nowrap',
  saveButton:
    'px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-dark-purple transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-opacity-50 disabled:bg-brand-light-gray disabled:text-brand-dark-gray disabled:cursor-not-allowed whitespace-nowrap',
} as const;
