export const styles = {
  // 메인 컨테이너 flex 스타일
  mainContainer: 'flex flex-col w-full max-w-[480px] h-[calc(100vh-4rem)]',
  
  // StateIcon 영역 스타일 (15%)
  stateIconArea: 'w-full h-[15%] flex items-end justify-center',
  
  // HTMLFlipBook 영역 스타일 (85%)
  flipBookArea: 'w-full max-w-[480px] h-full flex items-center overflow-hidden',
  
  // 스크린 리더 전용 텍스트 스타일
  srOnly: 'sr-only',
  
  // 진행 상황 컨테이너 스타일
  progressContainer: 'flex flex-col gap-4',
} as const;
