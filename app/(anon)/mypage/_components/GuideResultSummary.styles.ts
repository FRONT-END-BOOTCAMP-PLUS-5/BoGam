export const styles = {
  // 컨테이너
  container: "bg-brand-white rounded-lg border border-brand-light-gray shadow-sm p-6 max-w-md mx-auto",
  
  // 제목
  title: "text-base font-semibold text-brand-black mb-4",
  
  // 게이지 컨테이너
  gaugeContainer: "flex flex-col items-center mb-6 relative",
  
  // 구분선
  divider: "border-t border-brand-light-gray my-4 mx-auto w-96",
  
  // 차트 래퍼
  chartWrapper: "relative w-64 h-32",
  
  // 중앙 텍스트
  centerText: "absolute inset-0 flex flex-col items-center justify-end items-end",
  
  // 게이지
  gauge: "relative",
  
  // 게이지 텍스트
  gaugeText: "absolute inset-0 flex flex-col items-center justify-center",
  
  // 안전도 라벨
  safetyLabel: "text-xs text-brand-black mt-2",
  
  // 안전도 단계
  safetyLevel: "bg-brand-light-blue text-brand-green px-1 rounded-full text-sm font-semibold",
  
  // 안전도 단계 컨테이너
  safetyLevelContainer: "relative",
  
  // 안전도 단계 위쪽 (흰색)
  safetyLevelTop: "absolute top-0 left-0 right-0 h-1/2 bg-brand-white",
  
  // 안전도 단계 텍스트
  safetyLevelText: "relative z-10 text-brand-black text-base font-semibold px-1",
  
  // 안전도 단계 아래쪽
  safetyLevelBottom: "absolute bottom-0 left-0 right-0 h-1/2 opacity-30",
  
  // 통계 컨테이너
  statsContainer: "grid grid-cols-5 gap-0 items-center [grid-template-columns:1fr_16px_1fr_16px_1fr]",
  
  // 통계 카드
  statCard: "flex flex-col items-center text-center py-2",
  
  // 통계 카드 구분선
  statDivider: "w-px bg-brand-light-gray h-24 self-center mx-auto",
  
  // 통계 라벨
  statLabel: "text-xs text-brand-black mb-1 mt-3",
  
  // 통계 값
  statValue: "text-sm font-semibold text-brand-black"
} as const;
