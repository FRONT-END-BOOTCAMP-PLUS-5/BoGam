import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { BrokerRiskAssessmentResult } from '@/hooks/useBrokerRiskAssessment';
import { TaxCertRiskAssessmentResult } from '@/hooks/useTaxCertRiskAssessment';

// 위험도 검사 결과를 JSON 형태로 변환하는 타입
export type RiskAssessmentJsonData = Record<
  string,
  'match' | 'mismatch' | 'unchecked'
>;

// 등기부등본 위험도 검사 결과를 JSON으로 변환
export const convertRealEstateRiskAssessmentToJson = (
  riskAssessment: RiskAssessmentResult
): RiskAssessmentJsonData => {
  const jsonData: RiskAssessmentJsonData = {};

  // 위험 키워드들 (DANGEROUS_KEYWORDS)
  const dangerousKeywords = [
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
  ];

  // 각 키워드별로 상태 설정
  dangerousKeywords.forEach((keyword) => {
    const keywordCheck = riskAssessment.keywordChecks.find(
      (check) => check.keyword === keyword
    );
    if (keywordCheck) {
      if (keywordCheck.passed) {
        jsonData[keyword] = 'match';
      } else {
        jsonData[keyword] = 'mismatch';
      }
    } else {
      jsonData[keyword] = 'unchecked';
    }
  });

  return jsonData;
};

// 중개업자 위험도 검사 결과를 JSON으로 변환
export const convertBrokerRiskAssessmentToJson = (
  riskAssessment: BrokerRiskAssessmentResult
): RiskAssessmentJsonData => {
  const jsonData: RiskAssessmentJsonData = {};

  // 중개업자 안전도 검사 키워드들
  const brokerSafetyKeywords = [
    '중개업자 등록',
    '사업자 상호',
    '등록번호',
    '자격증 번호',
    '공인중개사',
    '대표',
  ];

  // 각 키워드별로 상태 설정
  brokerSafetyKeywords.forEach((keyword) => {
    const keywordCheck = riskAssessment.keywordChecks.find(
      (check) => check.keyword === keyword
    );
    if (keywordCheck) {
      if (keywordCheck.passed) {
        jsonData[keyword] = 'match';
      } else {
        jsonData[keyword] = 'mismatch';
      }
    } else {
      jsonData[keyword] = 'unchecked';
    }
  });

  return jsonData;
};

// 납세증명서 위험도 검사 결과를 JSON으로 변환
export const convertTaxCertRiskAssessmentToJson = (
  riskAssessment: TaxCertRiskAssessmentResult
): RiskAssessmentJsonData => {
  const jsonData: RiskAssessmentJsonData = {};

  // 납세증명서 안전도 검사 키워드들
  const taxCertSafetyKeywords = ['납세상태 해당없음'];

  // 키워드별로 상태 설정
  taxCertSafetyKeywords.forEach((keyword) => {
    const keywordCheck = riskAssessment.keywordChecks.find(
      (check) => check.keyword === keyword
    );
    if (keywordCheck) {
      if (keywordCheck.passed) {
        jsonData[keyword] = 'match';
      } else {
        jsonData[keyword] = 'mismatch';
      }
    } else {
      jsonData[keyword] = 'unchecked';
    }
  });

  // 체크리스트 항목들 추가
  riskAssessment.checklistItems.forEach((item) => {
    if (item.checked) {
      jsonData[item.label] = 'match';
    } else {
      jsonData[item.label] = 'mismatch';
    }
  });

  return jsonData;
};

// JSON 데이터를 위험도 검사 결과로 변환 (기존 데이터 로딩용)
export const convertJsonToRiskAssessment = (
  jsonData: RiskAssessmentJsonData,
  domain: 'realEstate' | 'broker' | 'taxCert'
): {
  keywordChecks: Array<{
    keyword: string;
    passed: boolean;
    foundCount: number;
  }>;
  checklistItems?: Array<{
    id: string;
    label: string;
    checked: boolean;
    description: string;
  }>;
} => {
  const keywordChecks: Array<{
    keyword: string;
    passed: boolean;
    foundCount: number;
  }> = [];
  const checklistItems: Array<{
    id: string;
    label: string;
    checked: boolean;
    description: string;
  }> = [];

  Object.entries(jsonData).forEach(([key, value]) => {
    const passed = value === 'match';
    const foundCount = value === 'mismatch' ? 1 : 0;

    // 체크리스트 항목인지 확인 (납세증명서의 경우)
    if (domain === 'taxCert' && !['납세상태 해당없음'].includes(key)) {
      checklistItems.push({
        id: key.toLowerCase().replace(/\s+/g, '-'),
        label: key,
        checked: passed,
        description: `${key} 확인`,
      });
    } else {
      keywordChecks.push({
        keyword: key,
        passed,
        foundCount,
      });
    }
  });

  return {
    keywordChecks,
    checklistItems: domain === 'taxCert' ? checklistItems : undefined,
  };
};

// 위험도 검사 결과가 수정되었는지 확인
export const isRiskAssessmentModified = (
  originalJson: RiskAssessmentJsonData,
  currentJson: RiskAssessmentJsonData
): boolean => {
  const originalKeys = Object.keys(originalJson);
  const currentKeys = Object.keys(currentJson);

  // 키 개수가 다르면 수정됨
  if (originalKeys.length !== currentKeys.length) {
    return true;
  }

  // 값이 다른 키가 있으면 수정됨
  for (const key of originalKeys) {
    if (originalJson[key] !== currentJson[key]) {
      return true;
    }
  }

  return false;
};
