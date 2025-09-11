export const styles = {
  // 전체 북커버 컨테이너 (기존 모양 유지)
  bookCover: 'bg-brand w-full h-full flex items-start justify-start box-border relative',
  
  // 왼쪽 영역 컨테이너 스타일 - vh 기준 반응형 너비
  leftDiv: 'w-[6vh] h-full flex flex-col bg-transparent border-none shadow-none flex-shrink-0',
  
  // 왼쪽 첫 번째 박스 스타일 (상단) - vh 기준 반응형 테두리
  leftFirst: "flex-1 border-r-[1vh] border-b-[0.5vh] border-brand-light-gray",
  
  // 왼쪽 중앙 박스 스타일 (중간) - vh 기준 반응형 테두리
  leftCenter: "flex-1 border-t-[0.5vh] border-r-[1vh] border-b-[0.5vh] border-brand-light-gray",
  
  // 왼쪽 마지막 박스 스타일 (하단) - vh 기준 반응형 테두리
  leftLast: "flex-1 border-t-[0.5vh] border-r-[1vh] border-brand-light-gray",
  
  // 오른쪽 영역 컨테이너 스타일
  rightContainer: 'h-full w-full flex flex-col relative items-center justify-center gap-[1.7vh] p-[1.7vh]',
  
  // 오른쪽 첫 번째 외부 박스 스타일 (제목 영역) - vh 기준 반응형 크기와 패딩
  rightFirstOutsideBox: 'flex w-full bg-white h-[7vh] rounded-lg p-[1vh]',
  
  // 요약 제목 스타일 (제목 테두리 + 텍스트) - vh 기준 반응형 폰트와 패딩
  summaryTitle: 'relative w-full h-full border-2 border-brand rounded-lg flex items-center justify-center font-bold text-[1.6vh]',
  
  // 흰색 종이 스타일 (메인 콘텐츠 영역) - vh 기준 반응형 크기와 마진
  whitePaper: 'w-full bg-white rounded-lg flex-1 overflow-y-auto',
  
  // 주제 제목 스타일 (섹션 제목) - vh 기준 반응형 폰트와 패딩
  topic: 'text-[1.6vh] font-bold p-[1.5vh] border-b border-b-brand-light-gray',
  
  // 소개 콘텐츠 스타일 (본문 텍스트) - vh 기준 반응형 폰트와 패딩
  introContent: 'text-[1.3vh] px-[1.5vh] pt-[1vh] leading-[1.8]',
  
  // 북커버 다크 그린 스타일 (후기 단계용)
  bookCoverGreen: 'bg-brand-dark-green w-full h-full flex items-start justify-start box-border relative'
} as const;
