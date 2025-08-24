export const styles = {
  value: 'text-sm text-brand-black bg-brand-light-gray p-2 rounded border',
  error: 'p-3 bg-red-50 border border-brand-error rounded-md',

  // 간편인증 그리드 컨테이너
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

  // 간편인증 방법 선택 버튼
  authMethodButton:
    '!mt-0 !h-auto !px-4 !py-3 border-2 border-brand-light-gray rounded-lg bg-brand-white hover:border-brand focus:border-brand focus:outline-none transition-colors duration-200 flex items-center justify-between',
  selectedAuthMethod: 'flex items-center space-x-3',
  authIconSmall: 'w-6 h-6 object-contain',
  selectedAuthText: 'text-sm font-medium text-brand-black',
  placeholderText: 'text-brand-dark-gray',
  dropdownArrow: 'text-brand-dark-gray text-sm',

  // 2-way 인증 모달 스타일
  twoWayContent: 'space-y-4',
  twoWayMessage: 'text-sm text-brand-dark-gray leading-relaxed',
  twoWayInfo: 'bg-brand-light-gray p-3 rounded-lg space-y-2',
  twoWayWarning: 'text-brand-error text-sm font-medium',
  twoWayInstructions: 'space-y-2',

  // 아코디언 스타일
  accordionContainer: 'w-full',
  accordionHeader:
    'w-full flex items-center justify-between p-3 bg-brand-light-gray rounded-lg hover:bg-brand-light-blue transition-colors duration-200',
  accordionTitle: 'text-sm font-medium text-brand-dark-gray',
  accordionIcon: 'text-brand-dark-gray text-sm',
  accordionContent: 'mt-3 space-y-4',
  gridTwo: 'grid grid-cols-2 gap-4',
};
