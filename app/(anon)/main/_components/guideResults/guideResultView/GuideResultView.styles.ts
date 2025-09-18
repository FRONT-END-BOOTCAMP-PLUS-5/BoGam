export const styles = {
  card: "bg-brand-white rounded-lg border border-brand-light-gray shadow-md p-6 max-w-md mx-auto w-full",
  cardTitle: "text-base font-semibold text-brand-black mb-2",
  lastModified: "text-xs text-brand-dark-gray text-right",
  
  guideResultHeader: "flex justify-between items-center mb-4",
  
  // CircularIconBadge 컨테이너 - ResultAccordion의 numbers와 정확히 정렬
  // ResultAccordion header 구조: title(flex-1) + numbers(flex-shrink-0) + icon(flex-shrink-0)
  iconBadgeContainer: "flex justify-end mb-4",
  
  // CircularIconBadge 영역을 위한 새로운 스타일
  iconBadgeHeader: "w-full px-4 pt-0 flex items-center justify-between bg-white mb-0",
  iconBadgeTitle: "text-sm font-medium text-brand-black text-left flex items-center flex-1 min-w-0 opacity-0", // 투명하게 만들어서 안 보이게
  iconBadgeStageNumber: "font-bold text-brand-black flex-shrink-0",
  iconBadgeSubtitle: "font-normal text-brand-black ml-1 truncate",
  iconBadgeNumbersContainer: "flex items-center space-x-6",
  iconBadgeNumbers: "flex items-center space-x-2 sm:space-x-4 text-xs text-brand-black flex-shrink-0",
  iconBadgeIcon: "w-5 h-5 text-brand-dark-gray flex-shrink-0",
  
  guideSteps: "space-y-0",
  stepContent: "p-4",
  
  // 임시 스타일 (간단하게)
  tempStepsContent: "space-y-4",
  tempStepsHeader: "mb-4",
  tempStepsDescription: "text-sm text-brand-dark-gray text-center",
  
  tempStepsItems: "space-y-3",
  tempStepItem: "bg-gray-50 rounded p-3 border border-gray-200",
  tempStepItemHeader: "flex justify-between items-center mb-2",
  tempStepItemNumber: "text-sm font-medium text-brand-black",
  tempStepItemStats: "text-xs text-brand-dark-gray",
  tempStepItemFooter: "text-xs text-brand-dark-gray/70 text-right",
  
  createdAt: "text-xs text-brand-dark-gray/70"
};
