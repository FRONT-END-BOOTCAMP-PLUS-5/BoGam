export const styles = {
  // 메인 콘텐츠
  mainContent: 'bg-brand-white p-6 h-full relative overflow-y-auto',

  // 스크롤바 커스텀 스타일
  scrollableContent:
    'h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar relative',

  // Swiper 컨테이너
  swiperContainer: 'h-[calc(100%-12rem)] overflow-y-auto custom-scrollbar',

  // 섹션 헤더 (CombinedContent용)
  sectionHeader: 'p-5 mb-6',
  sectionTitle: 'text-lg font-bold mb-2 text-brand-black',
  sectionSubtitle: 'text-base font-medium mb-2 text-brand-dark-gray',
} as const;
