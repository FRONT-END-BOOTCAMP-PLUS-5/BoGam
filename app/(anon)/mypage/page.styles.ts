export const styles = {
  // 기존 스타일
  container: "min-h-screen bg-brand-light-gray/30 relative w-full overflow-x-hidden",
  title: "text-2xl font-bold text-brand-black mb-8 text-center",
  accordionSection: "mt-8",
  accordionTitle: "text-xl font-semibold text-brand-black mb-4",
  tempContent: "space-y-3",
  tempText: "text-brand-dark-gray",
  
  // 그라데이션 배경
  gradientBackground: "absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-brand via-brand to-brand-light-gray/30",
  
  profileHeader: "relative py-6 px-6",
  profileContent: "flex flex-col items-center space-y-4 relative z-10 max-w-md mx-auto w-full",
  avatar: "w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-2xl font-bold text-white",
  profileInfo: "flex flex-col items-center space-y-2",
  profileName: "text-xl text-center text-white",
  questionIcon: "text-white/80",
  
  content: "px-6 py-6 space-y-6 w-full",
  
  card: "bg-brand-white rounded-lg border border-brand-light-gray shadow-sm p-6 max-w-md mx-auto w-full",
  cardHeader: "flex items-center space-x-2 px-6 py-4",
  starIcon: "text-brand-gold",
  cardTitle: "text-base font-semibold text-brand-black mb-2",
  
  documentButtons: "flex justify-evenly px-6",
  documentButton: "text-xl font-bold text-brand-black cursor-pointer hover:text-brand-blue transition-colors",
  
  summaryContent: "p-6",
  gaugeContainer: "flex justify-center mb-6",
  gauge: "relative w-32 h-16 bg-brand-light-gray rounded-t-full overflow-hidden",
  gaugeFill: "absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-t-full",
  gaugeText: "absolute inset-0 flex items-center justify-center text-sm font-medium text-brand-dark-gray",
  
  summaryStats: "grid grid-cols-3 gap-4",
  statItem: "flex flex-col items-center space-y-2",
  statLabel: "text-sm text-brand-dark-gray",
  statCount: "text-lg font-semibold text-brand-black",
  
  stepContent: "p-4",

  // 에러 상태 스타일
  errorContainer: "flex items-center justify-center min-h-screen",
  errorContent: "text-center",
  errorIcon: "text-red-500 text-6xl mb-4",
  errorTitle: "text-xl font-bold text-brand-black mb-2",
  errorMessage: "text-brand-dark-gray mb-4",
  errorButton: "px-4 py-2 bg-brand text-brand-white rounded-lg hover:bg-brand-90 transition-colors"
};
