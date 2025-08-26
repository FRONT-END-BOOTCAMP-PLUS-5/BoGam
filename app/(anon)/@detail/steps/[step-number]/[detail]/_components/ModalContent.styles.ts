export const styles = {
  // 메인 콘텐츠
  mainContent: 'bg-brand-white p-6 h-full relative overflow-y-auto',

  // 스크롤바 커스텀 스타일
  scrollableContent:
    'h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar relative',

  // 스텝 번호 헤더
  stepHeader: 'text-center p-4',
  stepTitle: 'text-xl font-semibold text-brand-black',

  // Swiper 컨테이너
  swiperContainer: 'h-[calc(100%-12rem)] overflow-y-auto custom-scrollbar',

  // 페이지 인디케이터 - 하단 고정
  pageIndicator: 'flex h-16 rounded-t-2xl justify-center items-center py-4 bg-brand-white border-t border-brand-light-gray absolute bottom-0 left-0 right-0 z-10',
  pageDot: 'w-2 h-2 mx-1 rounded-full transition-all duration-200 cursor-pointer',
  pageDotActive: 'bg-brand-blue',
  pageDotInactive: 'bg-brand-light-gray',

  // 섹션 헤더 (CombinedContent용)
  sectionHeader: 'mb-6',
  sectionTitle: 'text-lg font-bold mb-2 text-brand-black',
  sectionSubtitle: 'text-base font-medium mb-2 text-brand-dark-gray',
} as const;
