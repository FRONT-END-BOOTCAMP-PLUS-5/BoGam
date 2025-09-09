export const styles = {
  // 일반 흰색 페이지 기본 스타일
  contents: 'bg-brand-white w-full h-full flex flex-col box-border relative shadow-xl',
  
  // 상단 영역 - 반응형 패딩
  topSection: 'flex-none text-center p-[clamp(0.5rem,3vw,2rem)] border-b border-b-brand-light-gray',
  
  // 중간 영역 - 반응형 패딩과 간격
  middleSection: 'flex-1 p-[clamp(0.5rem,3vw,2rem)] flex flex-col gap-[clamp(0.5rem,3vw,3rem)]',
  
  // 하단 영역 - 반응형 패딩
  bottomSection: 'flex-none flex justify-end p-[clamp(0.5rem,3vw,2rem)] border-t border-t-brand-light-gray',
  
  // 작은 폰트 영역 스타일 - 반응형 패딩
  smallFontDiv: 'relative pb-[clamp(0.5vh,3vh,3vh)] pt-[clamp(0.5vh,3vh,3vh)] border-b border-b-brand-light-gray w-full',
  
  // 하단 경계선 영역 스타일 - 반응형 높이와 패딩
  borderBottomDiv: 'border-b border-b-brand-light-gray py-[clamp(1vh,5vh,6vh)] px-[clamp(2%,12%,15%)] h-[clamp(25vh,40vh,50vh)] max-h-[clamp(25vh,40vh,50vh)] overflow-y-auto',
  
  // 위험 표시 스타일 - 반응형 폰트와 너비
  danger: 'text-[clamp(0.75rem,3vw,2rem)] font-bold w-[clamp(0.75rem,12.5vw,20rem)] shadow-[inset_0px_-11px_0_rgba(194,74,74,0.3)]',
  
  // 콘텐츠 텍스트 스타일 - 반응형 폰트
  content: 'text-[clamp(0.625rem,3vw,1.5rem)] leading-[clamp(1.2,1.5,2)] flex flex-col',
  
  // 문단 스타일 - 반응형 마진
  paragraph: 'mb-[clamp(0.25rem,1.5vw,1.5rem)] last:mb-0',
  
  // 빈 줄 스타일 - 반응형 높이
  emptyLine: 'h-[clamp(0.25rem,1.5vw,1.5rem)]',
  
  // 이동 버튼 내부 스타일
  goInside: 'flex items-center text-[clamp(0.5rem,3.5vw,2.5rem)]',
  
  // 이동 버튼 컨테이너 스타일 - 반응형 위치와 높이
  goInsideDiv: 'flex items-center flex-1 w-full h-[clamp(8%,3vh,20%)] absolute bottom-0 left-[clamp(60%,75%,85%)]',
  
  // 작은 폰트 스타일 - 반응형 폰트와 패딩
  smallFont: 'font-bold text-[clamp(0.5rem,3vw,1.25rem)] flex items-center justify-center pt-[clamp(0.1vh,0.5vh,0.8vh)]'
} as const;
