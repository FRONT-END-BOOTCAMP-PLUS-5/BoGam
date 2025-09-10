export const styles = {
  // 카드 컨테이너
  cardContainer: 'bg-white rounded-lg shadow-md p-4 w-full',
  
  // 제목 영역
  titleArea: '',
  title: 'text-sm font-medium text-brand-black',
  subtitle: 'text-xs',
  
  // 메인 컨테이너
  mainContainer: 'flex items-center gap-5',
  
  // Progress Bar 영역 (바 + 퍼센트)
  progressArea: 'flex-1 relative',
  
  // Progress Bar 컨테이너
  progressContainer: 'h-4 bg-brand-light-gray rounded-full overflow-hidden',
  
  // 내부 flex 컨테이너
  innerContainer: 'h-full flex',
  
  // 퍼센트 표시 (바 위에 절대 위치, 해당 퍼센트 지점에)
  percentageText: 'absolute -top-4 text-[0.6rem] font-medium text-brand-dark-gray transform -translate-x-1/2',
  
  // 오른쪽 텍스트 영역
  textArea: 'flex flex-col gap-1 w-20',
  
  // 상태별 바 색상
  matchBar: 'bg-brand-green',
  mismatchBar: 'bg-brand-error', 
  uncheckedBar: 'bg-brand-light-gray',
  
  // 오른쪽 텍스트 아이템
  textItem: 'flex items-center gap-1 text-xs w-full',
  matchText: 'text-brand-green',
  mismatchText: 'text-brand-error',
  uncheckedText: 'text-brand-dark-gray',
  
  // 아이콘 컨테이너 (고정 너비)
  iconContainer: 'w-3 flex justify-center',
} as const;
