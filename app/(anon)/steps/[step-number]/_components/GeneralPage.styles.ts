export const styles = {
  // 일반 흰색 페이지 기본 스타일
  contents: 'bg-brand-white w-full h-full flex flex-col box-border relative shadow-xl',
  
  // 상단 영역
  topSection: 'flex-none text-center p-6 border-b border-b-brand-light-gray',
  
  // 중간 영역
  middleSection: 'flex-1 p-6',
  
  // 하단 영역
  bottomSection: 'flex-none flex justify-end p-6 border-t border-t-brand-light-gray',
  
  // 작은 폰트 영역 스타일
  smallFontDiv: 'relative pb-[2vh] pt-[2vh] border-b border-b-brand-light-gray w-full',
  
  // 하단 경계선 영역 스타일
  borderBottomDiv: 'border-b border-b-brand-light-gray py-[4vh] px-[10%] h-[38vh] max-h-[38vh] overflow-y-auto',
  
  // 위험 표시 스타일
  danger: 'text-[0.8em] font-bold w-[16%] shadow-[inset_0px_-11px_0_rgba(194,74,74,0.3)]',
  
  // 콘텐츠 텍스트 스타일
  content: 'text-[0.8em] mt-[4vh] leading-[2.5vh]',
  
  // 이동 버튼 내부 스타일
  goInside: 'flex items-center',
  
  // 이동 버튼 컨테이너 스타일
  goInsideDiv: 'flex items-center flex-1 w-full h-[13%] absolute bottom-0 left-[75%]',
  
  // 작은 폰트 스타일
  smallFont: 'font-bold text-[0.8em] flex items-center justify-center pt-[0.3vh]'
} as const;
