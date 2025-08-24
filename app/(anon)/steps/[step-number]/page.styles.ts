export const styles = {
  // 플립북 데모 스타일
  demoBook: 'mx-auto',
  
  // 페이지 기본 스타일
  page: 'bg-brand-white shadow-xl rounded-[8px] overflow-hidden relative',
  
  // 페이지 콘텐츠 영역 스타일
  pageContent: 'p-8 min-h-[600px] flex flex-col justify-center items-center',
  
  // 플렉스 컨테이너 스타일
  flex: 'flex h-full shadow-xl',
  
  // 인디케이터 래퍼 스타일
  indicatorWrapper: 'w-[180px] flex items-center justify-between relative',
  
  // 인디케이터 왼쪽 영역 스타일
  indicatorLeft: 'absolute left-0 top-0 h-full flex items-center',
  
  // 인디케이터 오른쪽 영역 스타일
  indicatorRight: 'absolute right-0 top-0 h-full flex items-center',
  
  // 인디케이터 점들 컨테이너 스타일
  indicatorDots: 'flex justify-center items-center w-full',
  
  // 인디케이터 화살표 버튼 스타일
  indicatorArrowBtn: 'bg-none border-none p-0 cursor-pointer h-6 flex items-center',
  
  // 인디케이터 화살표 버튼 비활성화 스타일
  disabled: 'cursor-not-allowed opacity-50',
  
  // 인디케이터 점 기본 스타일
  dot: 'h-2 w-2 rounded-full transition-all duration-200 ease-in-out bg-brand-light-gray mx-1.5',
  
  // 인디케이터 점 활성화 스타일
  dotActive: 'h-2 w-2 rounded-full transition-all duration-200 ease-in-out bg-brand-black mx-1.5',
  
  // 메인 컨테이너 flex 스타일
  mainContainer: 'flex flex-col items-center justify-center w-full max-w-[480px] h-[calc(100vh-4rem)] gap-8',
  
  // StateIcon 영역 스타일 (15%)
  stateIconArea: 'w-full h-[15%] flex items-end justify-center',
  
  // HTMLFlipBook 영역 스타일 (70%)
  flipBookArea: 'w-full h-[70%] flex items-center overflow-hidden',
  
  // 인디케이터 영역 스타일 (15%)
  indicatorArea: 'w-full h-[15%] flex items-start justify-center'
} as const;
