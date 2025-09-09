export const styles = {
  // 전체 북커버 컨테이너 (기존 모양 유지)
  bookCover: 'bg-brand w-full h-full flex items-start justify-start box-border relative',
  
  // 왼쪽 영역 컨테이너 스타일 - 반응형 너비
  leftDiv: 'w-[clamp(1.5rem,10vw,5rem)] h-full flex flex-col bg-transparent border-none shadow-none flex-shrink-0',
  
  // 왼쪽 첫 번째 박스 스타일 (상단) - 반응형 테두리
  leftFirst: "flex-1 border-r-[clamp(0.2rem,2vw,1rem)] border-b-[clamp(0.1rem,1vw,0.5rem)] border-brand-light-gray",
  
  // 왼쪽 중앙 박스 스타일 (중간) - 반응형 테두리
  leftCenter: "flex-1 border-t-[clamp(0.1rem,1vw,0.5rem)] border-r-[clamp(0.2rem,2vw,1rem)] border-b-[clamp(0.1rem,1.2vw,0.5rem)] border-brand-light-gray",
  
  // 왼쪽 마지막 박스 스타일 (하단) - 반응형 테두리
  leftLast: "flex-1 border-t-[clamp(0.1rem,1vw,0.5rem)] border-r-[clamp(0.2rem,2vw,1rem)] border-brand-light-gray",
  
  // 오른쪽 영역 컨테이너 스타일
  rightContainer: 'h-full w-full flex flex-col relative items-center justify-center gap-[clamp(0.25rem,2.5vw,2rem)] p-[clamp(0.25rem,2.5vw,2rem)]',
  
  // 오른쪽 첫 번째 외부 박스 스타일 (제목 영역) - 반응형 크기와 패딩
  rightFirstOutsideBox: 'flex w-full bg-white h-[clamp(2rem,6vh,6rem)] rounded-lg p-[clamp(0.125rem,1.5vw,1rem)]',
  
  // 요약 제목 스타일 (제목 테두리 + 텍스트) - 반응형 폰트와 패딩
  summaryTitle: 'relative w-full h-full border-2 border-brand rounded-lg flex items-center justify-center font-bold text-[clamp(0.6em,3vw,1.4em)] pt-[clamp(0.1vh,0.5vh,0.8vh)]',
  
  // 흰색 종이 스타일 (메인 콘텐츠 영역) - 반응형 크기와 마진
  whitePaper: 'w-full bg-white rounded-lg flex-1 overflow-y-auto',
  
  // 흰색 종이 상단 영역 (제목) - 반응형 패딩
  whitePaperTop: 'flex-none pb-[clamp(0.25rem,3vw,2rem)] border-b border-b-brand-light-gray',
  
  // 흰색 종이 하단 영역 (내용) - 반응형 패딩
  whitePaperBottom: 'flex-1 pt-[clamp(0.25rem,3vw,2rem)] overflow-y-auto',
  
  // 주제 제목 스타일 (섹션 제목) - 반응형 폰트와 패딩
  topic: 'text-[clamp(0.625rem,3vw,1.5rem)] font-bold p-[clamp(0.25rem,3vw,2rem)] border-b border-b-brand-light-gray',
  
  // 소개 콘텐츠 스타일 (본문 텍스트) - 반응형 폰트와 패딩
  introContent: 'text-[clamp(0.5rem,3vw,1.25rem)] px-[clamp(0.25rem,3vw,2rem)] pt-[clamp(0.125rem,1.5vw,1rem)] leading-[clamp(1.2,1.5,2)]',
  
  // 북커버 다크 그린 스타일 (후기 단계용)
  bookCoverGreen: 'bg-brand-dark-green w-full h-full flex items-start justify-start box-border relative'
} as const;
