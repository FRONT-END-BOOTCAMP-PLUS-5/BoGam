export const styles = {
  // 컨테이너
  container: 'max-w-4xl mx-auto',
  form: 'space-y-6',

  // 메인 폼 컨테이너
  formContainer:
    'bg-brand-white p-6 rounded-lg shadow-sm border border-brand-light-gray',

  // 그리드 레이아웃 (한 줄에 한 개씩)
  gridContainer: 'grid grid-cols-1 gap-4',

  // 입력 필드
  input:
    'w-full px-3 py-2 border border-brand-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors',
  inputError:
    'w-full px-3 py-2 border border-brand-error rounded-md focus:outline-none focus:ring-2 focus:ring-brand-error focus:border-transparent transition-colors',
  addressinput: '!bg-brand-light-blue',

  // 셀렉트 박스
  select:
    'w-full px-3 py-2 border border-brand-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-brand-white appearance-none transition-colors',

  // 에러 메시지
  errorMessage: 'text-brand-error text-sm mt-1',

  // 도움말 텍스트
  helpText: 'text-xs text-brand-dark-gray mt-1',

  // 버튼 컨테이너
  buttonContainer: 'flex justify-center space-x-4 mt-6',

  // 버튼
  submitButton: 'px-6 py-2',
  resetButton: 'px-6 py-2',
} as const;
