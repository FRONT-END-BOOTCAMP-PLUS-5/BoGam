export const styles = {
  // 메인 컨테이너 - 고정 위치, 중앙 정렬, 높은 z-index
  container: "fixed left-1/2 bottom-8 transform -translate-x-1/2 z-[9999] min-w-[320px] max-w-[95vw] shadow-[0_8px_32px_0_rgba(75,114,166,0.18)] backdrop-blur-md bg-white/85 border border-brand-light-gray rounded-[1.25rem] p-6 animate-[fadeInPWA_0.4s_cubic-bezier(0.4,0,0.2,1)]",
  
  // 내용 영역 - flexbox로 텍스트와 버튼 배치
  content: "flex items-center justify-between gap-4",
  
  // 텍스트 섹션 - 제목과 설명이 들어가는 영역
  textSection: "flex-1",
  
  // 제목 - brand 컬러 사용, 큰 글씨, 굵은 폰트
  title: "text-lg font-bold text-brand mb-0.5",
  
  // 설명 - 회색 텍스트, 작은 글씨
  description: "text-sm text-brand-dark-gray mt-1",
  
  // 버튼 섹션 - 나중에와 설치 버튼이 들어가는 영역
  buttonSection: "flex gap-2 ml-4",
  
  // 나중에 버튼 - 투명 배경, hover 시 brand-black으로 변경
  dismissButton: "text-sm text-brand-dark-gray bg-none border-none px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-200 hover:text-brand-black",
  
  // 설치 버튼 - brand 컬러 그라데이션, hover 시 brand-dark-blue로 변경
  installButton: "text-sm text-white bg-gradient-to-r from-brand to-brand-90 px-5 py-1.5 rounded-lg font-semibold cursor-pointer shadow-[0_2px_8px_rgba(75,114,166,0.08)] transition-all duration-200 hover:from-brand-dark-blue hover:to-brand",
  
  // 애니메이션 - PWA 설치 프롬프트가 아래에서 위로 나타나는 효과
  animation: `
    @keyframes fadeInPWA {
      from { 
        opacity: 0; 
        transform: translateY(30px) translateX(-50%); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) translateX(-50%); 
      }
    }
  `
};
