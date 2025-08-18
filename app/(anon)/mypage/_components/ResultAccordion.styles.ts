export const styles = {
  container: "w-full bg-white overflow-hidden",
  header: "w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-brand-light-gray transition-colors duration-200",
  
  // 제목 영역: flex-1로 남은 공간을 모두 차지하고, min-w-0으로 말줄임표 처리를 위한 최소 너비 설정
  title: "text-sm font-medium text-brand-black text-left flex items-center flex-1 min-w-0",
  
  // 단계 번호: flex-shrink-0으로 줄어들지 않도록 고정 크기 유지
  stageNumber: "font-bold text-brand-black flex-shrink-0",
  
  // 제목 (닫힌 상태): truncate 클래스로 긴 텍스트를 "..."으로 표시
  // truncate = overflow: hidden + text-overflow: ellipsis + white-space: nowrap
  subtitle: "font-normal text-brand-black ml-1 truncate",
  
  // 제목 (펼쳐진 상태): truncate 없이 전체 텍스트 표시
  subtitleExpanded: "font-normal text-brand-black ml-1",
  
  // 숫자 영역: flex-shrink-0으로 줄어들지 않도록 고정 크기 유지
  numbers: "flex items-center space-x-4 text-xs text-brand-black flex-shrink-0",
  numberItem: "w-4 text-center",
  
  // 화살표 아이콘들: flex-shrink-0으로 줄어들지 않도록 고정 크기 유지
  icon: "w-5 h-5 text-brand-dark-gray flex-shrink-0",
  iconOpen: "w-5 h-5 text-brand-gold flex-shrink-0",
  
  // 아코디언 내용 영역
  content: "bg-brand-light-gray/20 border-t border-brand-light-gray/20 overflow-hidden transition-all duration-300 ease-in-out",
  contentClosed: "max-h-0 py-0 px-0 opacity-0 border-t-0",
  contentOpen: "max-h-[1000px] py-4 px-4 opacity-100",
  bottomBorder: "border-b border-brand-light-gray"
} as const;
