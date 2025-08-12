export const styles = {
  // 컨테이너
  container: "bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-md mx-auto",
  
  // 제목
  title: "text-lg font-semibold text-gray-900 mb-6",
  
  // 게이지 컨테이너
  gaugeContainer: "flex justify-center mb-8",
  
  // 게이지
  gauge: "relative",
  
  // 게이지 텍스트
  gaugeText: "absolute inset-0 flex flex-col items-center justify-center",
  
  // 안전도 라벨
  safetyLabel: "text-sm text-gray-500 mb-1",
  
  // 안전도 단계
  safetyLevel: "bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-lg font-semibold",
  
  // 통계 컨테이너
  statsContainer: "grid grid-cols-3 gap-4",
  
  // 통계 카드
  statCard: "flex flex-col items-center text-center",
  
  // 통계 아이콘
  statIcon: "mb-2",
  
  // 안전 아이콘
  safeIcon: "w-10 h-10 bg-green-500 rounded-full flex items-center justify-center",
  
  // 경고 아이콘
  warningIcon: "w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center",
  
  // 미확인 아이콘
  unconfirmedIcon: "w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center",
  
  // 경고 이모지
  warningEmoji: "text-white text-lg",
  
  // 통계 라벨
  statLabel: "text-sm text-gray-600 mb-1",
  
  // 통계 카운트
  statCount: "text-lg font-semibold text-gray-900"
} as const;
