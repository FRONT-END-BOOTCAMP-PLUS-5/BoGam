export const styles = {
  // 컨테이너
  container: 'max-w-6xl mx-auto p-6',
  
  // 제목
  title: 'text-2xl font-bold text-brand-black mb-6',
  
  // 탭 컨테이너
  tabContainer: 'flex border-b border-brand-light-gray mb-6',
  
  // 탭 버튼 기본 스타일
  tab: 'rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer border-b-2 transition-colors',
  
  // 활성화된 탭
  activeTab: 'bg-brand text-brand-white ',
  
  // 비활성화된 탭
  inactiveTab: 'border-transparent text-brand-dark-gray hover:text-brand-black',
  
  // 탭 컨텐츠 영역
  tabContent: 'mt-6',
} as const;
