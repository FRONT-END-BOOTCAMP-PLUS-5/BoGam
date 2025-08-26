export const styles = {
  // 컨테이너
  container: 'w-full h-full',

  // 탭 네비게이션
  tabNavigation: 'flex justify-between mb-0',

  // 탭 버튼 공통 스타일
  tab: 'flex-1 px-6 py-3 text-xs font-medium rounded-t-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50',

  // 활성 탭
  activeTab:
    'bg-brand-90 text-brand-white border-b-2 border-brand-white relative z-10 shadow-sm',

  // 비활성 탭
  inactiveTab:
    'bg-brand-light-gray text-brand-dark-gray hover:bg-brand-gray hover:text-brand-black',

  // 탭 컨텐츠
  tabContent:
    'w-full h-full bg-brand-white border border-brand-light-gray rounded-b-lg p-6 min-h-80',
} as const;
