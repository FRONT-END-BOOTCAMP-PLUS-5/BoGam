export const styles = {
  // 컨테이너
  container: 'w-full h-4 bg-brand-light-gray rounded-full overflow-hidden',
  
  // 내부 flex 컨테이너
  innerContainer: 'h-full flex',
  
  // 상태별 바 색상
  matchBar: 'bg-brand-green',
  mismatchBar: 'bg-brand-error', 
  uncheckedBar: 'bg-brand-light-gray',
} as const;
