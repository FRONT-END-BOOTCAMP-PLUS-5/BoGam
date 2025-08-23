export const styles = {
  // 메인 콘텐츠
  mainContent: 'bg-brand-white p-6 h-full relative overflow-y-auto',

  // 스텝 번호 헤더
  stepHeader: 'text-center p-4',
  stepTitle: 'text-xl font-semibold text-brand-black',

  // Swiper 컨테이너
  swiperContainer: 'h-[calc(100%-12rem)]',

  // 페이지 인디케이터
  pageIndicator: 'flex justify-center items-center mt-4',
  pageDot: 'w-2 h-2 mx-1 rounded-full transition-all duration-200',
  pageDotActive: 'bg-brand-blue',
  pageDotInactive: 'bg-brand-light-gray',

  // 섹션 헤더 (CombinedContent용)
  sectionHeader: 'mb-6',
  sectionTitle: 'text-lg font-semibold mb-2',
  sectionSubtitle: 'text-sm text-brand-dark-gray',

  // 페이지 네비게이션
  pageNavigation: 'flex justify-center items-center gap-4 mt-4',
  navButton: 'px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-dark-blue disabled:opacity-50 disabled:cursor-not-allowed',

  // 컨테이너
  container: 'w-full h-full',
  loadingContainer: 'flex justify-center items-center h-full text-brand-dark-gray',
} as const;
