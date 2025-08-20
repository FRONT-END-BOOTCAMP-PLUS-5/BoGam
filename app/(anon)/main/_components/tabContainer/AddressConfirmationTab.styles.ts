export const styles = {
  // 컨테이너
  container: 'w-full space-y-6',

  // 첫 번째 줄: 버튼들
  buttonRow:
    'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
  actionButtons: 'flex flex-col sm:flex-row gap-2 w-full sm:w-auto',

  // 두 번째 줄: 입력 필드들
  inputRow: 'flex flex-col lg:flex-row gap-4 items-start lg:items-center',
  dongHoInputs: 'flex gap-2 w-full lg:w-auto',

  // 메인 행 (주소 검색 + 동/호 입력)
  mainRow: 'flex flex-col lg:flex-row gap-4 items-start lg:items-center',
  searchSection:
    'flex flex-col sm:flex-row gap-2 items-start sm:items-center flex-1 w-full',
  dongHoSection: 'flex gap-2 items-center w-full lg:w-auto',

  // 주소 검색 행
  searchRow:
    'flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full',
  searchButton: 'w-full sm:w-auto',
  searchInput: 'w-full',

  // 동/호 입력 행
  dongHoRow: 'flex items-center gap-2',
  dongField: 'w-10',
  hoField: 'w-10',
  dongHoSeparator: 'text-sm text-brand-dark-gray font-medium whitespace-nowrap',

  // 버튼 행
  confirmButton: 'w-full sm:w-auto',
  saveButton: 'w-full sm:w-auto',
} as const;
