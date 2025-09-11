export const styles = {
  // FlipBookSection 내부 flex 스타일
  flipBookSection: 'flex flex-col w-full h-full',
  
  // FlipBook 영역 (85%)
  flipBook: 'w-full h-[85%] flex items-center overflow-hidden',
  
  // PageIndicator 영역 (15%)
  pageIndicator: 'w-full h-[15%] flex items-start justify-center',
} as const;
