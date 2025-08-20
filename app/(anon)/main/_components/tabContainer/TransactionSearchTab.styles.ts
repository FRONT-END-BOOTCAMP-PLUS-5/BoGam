export const styles = {
  // 컨테이너
  container: 'space-y-6',

  // 안내 메시지
  instruction: 'text-lg font-semibold text-brand-black mb-4',

  // 주소 표시
  addressDisplay: 'p-3 bg-brand-light-blue rounded-lg',
  addressLabel: 'text-sm font-medium text-brand-dark-gray',
  addressValue: 'text-sm text-brand-black ml-2',

  // 폼 컨테이너
  formContainer: 'space-y-4',

  // 폼 행
  formRow: 'flex flex-col space-y-2',
  label: 'text-sm font-medium text-brand-dark-gray',
  input:
    'px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',
  select:
    'px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',

  // 단지명 입력 그룹
  complexInputGroup: 'flex gap-2',
  complexInput:
    'flex-1 px-3 py-2 border border-brand-light-gray rounded-lg bg-brand-white text-brand-black placeholder-brand-dark-gray focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent',
  fetchButton:
    'px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50',

  // 버튼 컨테이너
  buttonContainer: 'pt-4',
  searchButton:
    'w-full px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 disabled:bg-brand-light-gray disabled:text-brand-dark-gray disabled:cursor-not-allowed',
} as const;
