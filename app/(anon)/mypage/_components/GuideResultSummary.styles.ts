export const styles = {
  // 컨테이너
  container: "bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-md mx-auto",
  
  // 제목
  title: "text-base font-semibold text-[var(--brand-black)] mb-4",
  
  // 게이지 컨테이너
  gaugeContainer: "flex flex-col items-center mb-6 relative",
  
  // 구분선
  divider: "border-t border-[var(--brand-light-gray)] my-4 mx-auto w-96",
  
  // 차트 래퍼
  chartWrapper: "relative w-64 h-32",
  
  // 중앙 텍스트
  centerText: "absolute inset-0 flex flex-col items-center justify-end",
  
  // 게이지
  gauge: "relative",
  
  // 게이지 텍스트
  gaugeText: "absolute inset-0 flex flex-col items-center justify-center",
  
  // 안전도 라벨
  safetyLabel: "text-xs text-[var(--brand-black)] mb-1 mt-2",
  
  // 안전도 단계
  safetyLevel: "bg-teal-100 text-teal-800 px-1 py-0.5 rounded-full text-sm font-semibold",
  
  // 안전도 단계 컨테이너
  safetyLevelContainer: "relative",
  
  // 안전도 단계 위쪽 (흰색)
  safetyLevelTop: "absolute top-0 left-0 right-0 h-1/2 bg-[var(--brand-white)]",
  
  // 안전도 단계 텍스트
  safetyLevelText: "relative z-10 text-[var(--brand-black)] text-base font-semibold px-1 py-0.5",
  
  // 안전도 단계 아래쪽
  safetyLevelBottom: "absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--brand-green)] opacity-30",
  
  // 통계 컨테이너
  statsContainer: "grid grid-cols-5 gap-0 items-center [grid-template-columns:1fr_16px_1fr_16px_1fr]",
  
  // 통계 카드
  statCard: "flex flex-col items-center text-center py-2",
  
  // 통계 카드 구분선
  statDivider: "w-px bg-[var(--brand-light-gray)] h-24 self-center mx-auto",
  
  // 통계 아이콘
  statIcon: "w-8 h-8 rounded-full flex items-center justify-center mb-1",
  
  // 체크마크
  checkmark: "text-[var(--brand-green)] text-sm font-bold",
  
  // 이모지
  emoji: "text-[var(--error)] text-sm",
  
  // X마크
  xmark: "text-[var(--brand-light-gray)] text-sm font-bold",
  
  // 안전 아이콘
  safeIcon: "w-10 h-10 bg-[var(--brand-green)] rounded-full flex items-center justify-center",
  
  // 경고 아이콘
  warningIcon: "w-10 h-10 bg-[var(--error)] rounded-full flex items-center justify-center",
  
  // 미확인 아이콘
  unconfirmedIcon: "w-10 h-10 bg-[var(--brand-light-gray)] rounded-full flex items-center justify-center",
  
  // 경고 이모지
  warningEmoji: "text-[var(--brand-white)] text-lg",
  
  // 통계 라벨
  statLabel: "text-xs text-[var(--brand-black)] mb-1",
  
  // 통계 값
  statValue: "text-sm font-semibold text-[var(--brand-black)]",
  
  // 통계 카운트
  statCount: "text-lg font-semibold text-[var(--brand-black)]"
} as const;
