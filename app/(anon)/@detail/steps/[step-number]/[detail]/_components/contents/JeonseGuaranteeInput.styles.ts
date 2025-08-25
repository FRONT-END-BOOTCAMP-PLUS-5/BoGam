export const jeonseGuaranteeInputStyles = {
  container: '',
  header: 'mb-6',
  title: 'text-xl font-bold text-brand-black mb-2',

  // 폼 필드 컨테이너
  formContainer: 'space-y-4',

  // 입력 필드 관련
  inputWrapper: 'relative',
  inputWithUnit: 'pr-20',
  unitDisplay:
    'absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-brand-dark-gray font-medium',

  // 월세 입력 필드
  monthlyRentContainer: 'flex gap-2',
  monthlyRentSelect: 'w-1/3',
  monthlyRentInputWrapper: 'relative flex-1',

  // 에러 메시지
  errorContainer: 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg',
  errorText: 'text-red-600 text-sm',
} as const;
