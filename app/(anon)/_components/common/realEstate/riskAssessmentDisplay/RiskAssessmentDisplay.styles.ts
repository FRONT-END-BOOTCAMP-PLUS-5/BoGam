export const styles = {
  // 위험도 측정 결과
  riskSection:
    'mb-6 bg-brand-light-blue/20 p-6 rounded-lg border border-brand-blue/30',
  riskTitle:
    'text-xl font-semibold text-brand-dark-blue flex items-center gap-2',
  riskScore: 'text-lg font-medium text-brand-black mb-4',

  // 위험 요소
  riskFactors: 'mb-6',
  riskFactorsTitle: 'font-semibold text-brand-black mb-3',
  riskFactor: 'bg-brand-white p-4 rounded-lg border border-brand-blue/30 mb-4',
  riskFactorHeader: 'flex items-center justify-between mb-3',
  riskFactorName: 'font-medium text-brand-black',
  riskLevel: 'px-3 py-1 rounded-full text-xs font-medium',
  riskLevelLOW: 'bg-brand-green/20 text-brand-green',
  riskLevelMEDIUM: 'bg-brand-gold/20 text-brand-gold',
  riskLevelHIGH: 'bg-brand-error/20 text-brand-error',
  riskLevelCRITICAL: 'bg-brand-error/20 text-brand-error',

  // 위험도 레벨 배지 (인라인 스타일용)
  riskLevelBadge: 'px-2 py-1 rounded text-xs font-medium',
  riskLevelBadgeCRITICAL: 'bg-brand-error/20 text-brand-error',
  riskLevelBadgeHIGH: 'bg-brand-error/20 text-brand-error',
  riskLevelBadgeMEDIUM: 'bg-brand-gold/20 text-brand-gold',
  riskLevelBadgeLOW: 'bg-brand-green/20 text-brand-green',
  riskFactorValue: 'text-sm text-brand-black mb-2 break-all',
  riskFactorDescription: 'text-sm text-brand-dark-gray mb-2',
  riskFactorKeywords: 'text-sm text-brand-blue font-medium',

  // 권장사항
  recommendations: 'mt-6',
  recommendationsTitle: 'font-semibold text-brand-black mb-3',
  recommendationsList: 'list-disc list-inside space-y-2',
  recommendationItem: 'text-sm text-brand-dark-gray',

  // 안전 상태
  safeContainer:
    'bg-brand-green/10 p-6 rounded-lg border border-brand-green/20 text-center',
  safeIcon: 'text-4xl mb-3',
  safeText: 'text-xl font-semibold text-brand-green mb-2',
  safeSubText: 'text-brand-dark-gray',

  // 키워드 체크 결과
  keywordChecksSection: 'mt-6',
  keywordChecksTitle: 'font-semibold text-brand-black mb-3',
  keywordChecksGrid: 'grid grid-cols-2 gap-3',
  keywordCheckItem:
    'bg-brand-white p-3 rounded-lg border border-brand-light-gray',
  keywordCheckHeader: 'flex flex-col items-center gap-2',
  keywordName: 'font-medium text-brand-black text-sm text-center',
  keywordStatus: 'text-xs font-medium px-2 py-1 rounded-full',
  keywordPassed: 'bg-brand-green/20 text-brand-green',
  keywordFailed: 'bg-brand-error/20 text-brand-error',
  keywordFoundCount: 'text-xs text-brand-error font-medium text-center',
  keywordClickable:
    'cursor-pointer hover:bg-brand-light-gray/50 transition-colors',

  // 헤더 레이아웃
  headerContainer: 'flex items-center justify-between mb-4',
  titleContainer: 'flex items-center gap-2',

  // 경고 표시
  warningContainer:
    'mb-6 p-4 bg-brand-error/10 border border-brand-error/20 rounded-lg',
  warningHeader: 'flex items-center gap-2 mb-3',
  warningIcon: 'text-2xl',
  warningTitle: 'text-lg font-semibold text-brand-error',
  warningText: 'text-brand-error/80 text-sm',

  // 키워드 분석
  keywordAnalysisContainer:
    'mb-6 p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-lg',
  keywordAnalysisHeader: 'flex items-center gap-2 mb-3',
  keywordAnalysisIcon: 'text-xl',
  keywordAnalysisTitle: 'text-lg font-semibold text-brand-gold',
  keywordAnalysisBadge:
    'px-2 py-1 bg-brand-gold/20 text-brand-gold text-xs rounded-full',
  keywordAnalysisContent: 'ml-6 space-y-3',

  // 키워드 상세 정보
  keywordDetailItem: 'bg-brand-white p-3 rounded border border-brand-gold/30',
  keywordDetailHeader: 'flex items-center justify-between mb-2',
  keywordDetailField: 'font-medium text-brand-black',
  keywordDetailLabel: 'text-sm text-brand-dark-gray mb-2',
  keywordDetailContent:
    'text-sm bg-brand-light-gray/50 p-2 rounded border-l-4 border-brand-gold',
  keywordDetailDescription: 'text-xs text-brand-dark-gray mt-2',

  // 체크리스트 스타일
  checklistSection: 'mt-6',
  checklistTitle: 'font-semibold text-brand-black mb-3',
  checklistGrid: 'grid grid-cols-1 gap-3',
  checklistItem:
    'p-3 rounded-lg border transition-colors duration-200 cursor-pointer',
  checklistItemChecked: 'bg-brand-green/20',
  checklistItemUnchecked: 'bg-brand-error/20',
  checklistItemHeader: 'flex flex-col gap-2 mb-2',
  checklistItemControls: 'flex items-center gap-4',
  checkboxLabel: 'flex items-center gap-2 cursor-pointer',
  checkboxInput:
    'w-4 h-4 text-brand-blue border-brand-black focus:ring-brand-blue appearance-none rounded border-2 checked:bg-brand-blue checked:border-brand-blue',
  checkboxText: 'text-sm text-brand-black',
  checklistItemLabel: 'font-medium text-brand-black text-sm',
  checklistItemDescription: 'text-xs text-brand-dark-gray',
} as const;
