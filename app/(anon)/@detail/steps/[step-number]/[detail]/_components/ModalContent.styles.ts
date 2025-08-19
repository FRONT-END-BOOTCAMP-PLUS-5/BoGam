export const modalContentStyles = {
  // 메인 콘텐츠
  mainContent: 'bg-brand-light-blue p-6 h-[calc(100%-8rem)] relative overflow-y-auto',

  // 스텝 번호 헤더
  stepHeader: 'text-center p-4',
  stepTitle: 'text-xl font-semibold text-brand-black',

  // Swiper 컨테이너
  swiperContainer: 'h-full',

  // 상세 정보 아이템
  detailItem: 'flex leading-relaxed mb-3',
  detailKey: 'font-medium text-brand-black min-w-[80px] flex-shrink-0 text-center',
  detailValue: 'text-brand-dark-gray',

  // null 값 스타일
  nullValue: 'text-brand-dark-gray',
} as const;
