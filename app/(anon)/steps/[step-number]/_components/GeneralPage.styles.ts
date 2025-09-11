export const styles = {
  // 일반 흰색 페이지 기본 스타일
  contents: 'bg-brand-white w-full h-full flex flex-col box-border relative shadow-xl',
  
  // 상단 영역 - vh 기준 반응형 패딩
  topSection: 'flex-none text-center p-[2.5vh] border-b border-b-brand-light-gray',
  
  // 중간 영역 - vh 기준 반응형 패딩과 간격
  middleSection: 'flex-1 p-[2.5vh] flex flex-col gap-[4vh]',
  
  // 하단 영역 - vh 기준 반응형 패딩
  bottomSection: 'flex-none flex justify-end p-[3vh] border-t border-t-brand-light-gray',
  
  // 위험 표시 스타일 - vh 기준 반응형 폰트와 너비
  danger: 'text-[1.7vh] font-bold w-[6.7vh] shadow-[inset_0px_-11px_0_rgba(194,74,74,0.3)]',
  
  // 콘텐츠 텍스트 스타일 - vh 기준 반응형 폰트
  content: 'text-[1.52vh] leading-[2] flex flex-col',
  
  // 문단 스타일 - vh 기준 반응형 마진
  paragraph: 'last:mb-0',
  
  // 빈 줄 스타일 - vh 기준 반응형 높이
  emptyLine: 'h-[2vh]',
  
  // 작은 폰트 스타일 - vh 기준 반응형 폰트와 패딩
  smallFont: 'font-bold text-[1.7vh] flex items-center justify-center',

  // 바로가기 버튼 스타일
  goInside: 'flex items-center text-[1.7vh]',
} as const;
