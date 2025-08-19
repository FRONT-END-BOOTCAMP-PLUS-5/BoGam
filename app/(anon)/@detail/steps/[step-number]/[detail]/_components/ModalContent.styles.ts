export const styles = {
  // 메인 콘텐츠
  mainContent: 'bg-brand-white p-6 h-full relative overflow-y-auto',

  // 스텝 번호 헤더
  stepHeader: 'text-center p-4',
  stepTitle: 'text-xl font-semibold text-brand-black',

  // Swiper 컨테이너
  swiperContainer: 'h-[calc(100%-12rem)]',

  // 상세 정보 아이템
  detailItem: 'flex leading-relaxed mb-3',
  detailKey: 'font-medium text-brand-black min-w-[5rem] flex-shrink-0 text-center',
  detailValue: 'text-brand-dark-gray',

  // null 값 스타일
  nullValue: 'text-brand-dark-gray',

  // 페이지 인디케이터
  pageIndicator: 'flex justify-center items-center mt-4',
  pageDot: 'w-2 h-2 mx-1 rounded-full transition-all duration-200',
  pageDotActive: 'bg-brand-blue',
  pageDotInactive: 'bg-brand-light-gray',

  // 로딩 및 에러 상태
  loadingContainer: 'flex items-center justify-center h-64',
  loadingText: 'text-lg text-brand-dark-gray',
  errorContainer: 'flex items-center justify-center h-64',
  errorText: 'text-lg text-brand-dark-gray',
} as const;
