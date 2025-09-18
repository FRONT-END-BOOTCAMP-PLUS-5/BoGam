export const styles = {
  container: 'space-y-6',
  formSection:
    'mb-8 p-5 border border-brand-light-gray rounded-lg bg-brand-light-gray',
  sectionTitle: 'text-lg font-bold mb-5 text-brand-black',
  authMethodButton:
    'w-full px-4 py-3 border border-brand-light-gray rounded-md bg-brand-white cursor-pointer flex items-center justify-between transition-colors hover:border-brand',
  selectedMethod: 'flex items-center gap-2',
  errorContainer:
    'my-5 p-3 bg-brand-error-light border border-brand-error rounded-md',
  errorText: 'text-brand-error m-0 text-sm',
  submitSection: 'mt-8 text-center',
  submitButton:
    'px-6 py-3 bg-brand text-brand-white border-none rounded-md text-base font-bold cursor-pointer transition-colors hover:bg-brand-dark disabled:bg-brand-light-gray disabled:cursor-not-allowed',
  // 간편인증 그리드 컨테이너 (SimpleAuthForm 스타일 적용)
  authGrid: 'grid grid-cols-3 gap-4',

  // 간편인증 아이템 기본 스타일
  authItem:
    'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md aspect-square flex items-center justify-center',

  // 간편인증 아이템 선택 상태
  authItemSelected: 'border-brand bg-brand-light-blue',

  // 간편인증 아이템 기본 상태
  authItemDefault: 'border-brand-light-gray hover:border-brand',

  // 간편인증 아이콘 컨테이너
  authIconContainer:
    'flex flex-col items-center space-y-1 w-full h-full justify-center',

  // 간편인증 아이콘
  authIcon: 'w-12 h-12 object-contain',

  // 간편인증 텍스트
  authText: 'text-xs font-medium text-brand-dark-gray',
};
