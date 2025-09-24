// 위험도 검사 관련 상수들
export const DANGEROUS_KEYWORDS = [
  '압류',
  '가압류',
  '경매',
  '강제집행',
  '체납',
  '미납',
  '부도',
  '파산',
  '해지',
  '취소',
  '임차권',
  '근저당권',
  '신탁',
] as const;

export const RISK_LEVEL_THRESHOLDS = {
  LOW: 11, // 11개 이상 통과 (13개 중 11개 이상)
  MEDIUM: 9, // 9-10개 통과
  HIGH: 0, // 9개 미만 통과
} as const;

export const DEFAULT_RISK_ASSESSMENT = {
  stepNumber: 1,
  riskLevel: 'LOW' as const,
  riskFactors: [],
  totalRiskScore: 0,
  recommendations: ['등기부등본 데이터가 없습니다.'],
  keywordChecks: DANGEROUS_KEYWORDS.map((keyword) => ({
    keyword,
    passed: true,
    foundCount: 0,
  })),
  totalKeywords: DANGEROUS_KEYWORDS.length,
  passedKeywords: DANGEROUS_KEYWORDS.length,
} as const;
