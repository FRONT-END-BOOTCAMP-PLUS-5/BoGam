export const styles = {
  // 전체 북커버 컨테이너 (기존 모양 유지)
  bookCover: 'bg-brand w-full h-full flex items-start justify-start box-border relative',
  
  // 왼쪽 영역 컨테이너 스타일
  leftDiv: 'w-[3.4rem] h-full flex flex-col bg-transparent border-none shadow-none flex-shrink-0',
  
  // 왼쪽 첫 번째 박스 스타일 (상단)
  leftFirst: "flex-1 border-r-[0.6rem] border-b-[0.3rem] border-brand-light-gray",
  
  // 왼쪽 중앙 박스 스타일 (중간)
  leftCenter: "flex-1 border-t-[0.3rem] border-r-[0.6rem] border-b-[0.3rem] border-brand-light-gray",
  
  // 왼쪽 마지막 박스 스타일 (하단)
  leftLast: "flex-1 border-t-[0.3rem] border-r-[0.6rem] border-brand-light-gray",
  
  // 오른쪽 영역 컨테이너 스타일
  rightContainer: 'h-full w-full flex flex-col relative',
  
  // 오른쪽 첫 번째 외부 박스 스타일 (제목 영역)
  rightFirstOutsideBox: 'w-[calc(100%-2rem)] bg-white h-16 rounded-lg mt-4 mx-4 p-2 relative',
  
  // 오른쪽 첫 번째 내부 박스 스타일 (제목 테두리)
  rightFirstInsideBox: 'relative w-full h-full border-2 border-brand rounded-lg flex items-center justify-center',
  
  // 작은 폰트 스타일 (제목 텍스트)
  smallFont: 'font-bold text-[0.8em] flex items-center justify-center pt-[0.3vh]',
  
  // 흰색 종이 스타일 (메인 콘텐츠 영역) - flex로 상-하 분할
  whitePaper: 'w-[calc(100%-2rem)] bg-white rounded-lg m-4 flex-1 overflow-y-auto',
  
  // 흰색 종이 상단 영역 (제목)
  whitePaperTop: 'flex-none pb-4 border-b border-b-brand-light-gray',
  
  // 흰색 종이 하단 영역 (내용)
  whitePaperBottom: 'flex-1 pt-4 overflow-y-auto',
  
  // 주제 제목 스타일 (섹션 제목)
  topic: 'text-sm font-bold p-4 border-b border-brand-light-gray',
  
  // 소개 콘텐츠 스타일 (본문 텍스트)
  introContent: 'text-xs px-4 pt-2 leading-relaxed',
  
  // 북커버 다크 그린 스타일 (후기 단계용)
  bookCoverGreen: 'bg-brand-dark-green w-full h-full flex items-start justify-start box-border relative'
} as const;
