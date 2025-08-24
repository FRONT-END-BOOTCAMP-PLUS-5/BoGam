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
] as const;

export const RISK_LEVEL_THRESHOLDS = {
  LOW: 8, // 8개 이상 통과
  MEDIUM: 6, // 6-7개 통과
  HIGH: 0, // 6개 미만 통과
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
