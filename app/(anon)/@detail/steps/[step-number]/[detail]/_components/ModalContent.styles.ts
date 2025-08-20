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
} as const;
