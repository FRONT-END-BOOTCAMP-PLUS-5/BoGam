export const styles = {
  // 인디케이터 영역 스타일
  indicatorArea: 'w-full h-[15%] flex items-start justify-center',
  
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
} as const;
