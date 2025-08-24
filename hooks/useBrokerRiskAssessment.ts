import { useMemo } from 'react';

export interface BrokerData {
  ldCodeNm?: string; // 시군구명
  jurirno?: string; // 등록번호
  bsnmCmpnm?: string; // 사업자상호
  brkrNm?: string; // 중개업자명
  brkrAsortCode?: string; // 중개업자종별코드
  brkrAsortCodeNm?: string; // 중개업자종별명
  crqfcNo?: string; // 자격증번호
  crqfcAcqdt?: string; // 자격증취득일
  ofcpsSeCode?: string; // 직위구분코드
  ofcpsSeCodeNm?: string; // 직위구분명
  lastUpdtDt?: string; // 데이터기준일자
  [key: string]: unknown;
}

export interface BrokerRiskFactor {
  fieldName: string;
  fieldValue: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  foundKeywords: string[];
}

export interface BrokerKeywordCheck {
  keyword: string;
  passed: boolean;
  foundCount: number;
}

export interface BrokerRiskAssessmentResult {
  stepNumber: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: BrokerRiskFactor[];
  totalRiskScore: number;
  recommendations: string[];
  keywordChecks: BrokerKeywordCheck[];
  totalKeywords: number;
  passedKeywords: number;
}

// 중개업자 안전도 검사 키워드 정의
const BROKER_SAFETY_KEYWORDS = [
  '중개업자 등록',
  '사업자 상호',
  '등록번호',
  '자격증 번호',
  '공인중개사',
  '대표',
];

export const useBrokerRiskAssessment = (
  brokerData: BrokerData | null,
  userInputName?: string,
  userInputBusinessName?: string
): BrokerRiskAssessmentResult => {
  return useMemo(() => {
    if (!brokerData) {
      return {
        stepNumber: 1,
        riskLevel: 'HIGH',
        riskFactors: [],
        totalRiskScore: 0,
        recommendations: ['중개업자 데이터가 없습니다.'],
        keywordChecks: BROKER_SAFETY_KEYWORDS.map((keyword) => ({
          keyword,
          passed: false,
          foundCount: 0,
        })),
        totalKeywords: BROKER_SAFETY_KEYWORDS.length,
        passedKeywords: 0,
      };
    }

    const riskFactors: BrokerRiskFactor[] = [];
    let passedKeywords = 0;
    const keywordChecks: BrokerKeywordCheck[] = [];
    const recommendations: string[] = [];

    // 1. 사용자가 입력한 이름으로 API를 조회 했을 때 data가 있는 지
    if (brokerData.brkrNm) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '중개업자 등록',
        passed: true,
        foundCount: 1,
      });
    } else {
      riskFactors.push({
        fieldName: '중개업자명',
        fieldValue: '등록 정보 없음',
        riskLevel: 'HIGH',
        description: '중개업자 등록 정보가 확인되지 않습니다.',
        foundKeywords: ['미등록'],
      });
      keywordChecks.push({
        keyword: '중개업자 등록',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('중개업자 등록 여부를 반드시 확인하세요.');
    }

    // 2. 사업자 상호까지 입력했을 땐 data가 명확히 있는 지
    if (brokerData.bsnmCmpnm) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '사업자 상호',
        passed: true,
        foundCount: 1,
      });
    } else {
      riskFactors.push({
        fieldName: '사업자 상호',
        fieldValue: '상호 정보 없음',
        riskLevel: 'MEDIUM',
        description: '사업자 상호 정보가 등록되어 있지 않습니다.',
        foundKeywords: ['상호미등록'],
      });
      keywordChecks.push({
        keyword: '사업자 상호',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('사업자 상호 정보를 확인하세요.');
    }

    // 3. 등록번호가 있는 지
    if (brokerData.jurirno) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '등록번호',
        passed: true,
        foundCount: 1,
      });
    } else {
      riskFactors.push({
        fieldName: '등록번호',
        fieldValue: '등록번호 없음',
        riskLevel: 'HIGH',
        description: '중개업자 등록번호가 확인되지 않습니다.',
        foundKeywords: ['등록번호미등록'],
      });
      keywordChecks.push({
        keyword: '등록번호',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('중개업자 등록번호를 반드시 확인하세요.');
    }

    // 4. 자격증 번호가 있는 지
    if (brokerData.crqfcNo) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '자격증 번호',
        passed: true,
        foundCount: 1,
      });
    } else {
      riskFactors.push({
        fieldName: '자격증번호',
        fieldValue: '자격증번호 없음',
        riskLevel: 'HIGH',
        description: '중개업자 자격증번호가 확인되지 않습니다.',
        foundKeywords: ['자격증번호미등록'],
      });
      keywordChecks.push({
        keyword: '자격증 번호',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('중개업자 자격증번호를 반드시 확인하세요.');
    }

    // 5. 중개업자종별명이 "공인중개사"인 지
    if (brokerData.brkrAsortCodeNm === '공인중개사') {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '공인중개사',
        passed: true,
        foundCount: 1,
      });
    } else {
      const currentType = brokerData.brkrAsortCodeNm || '공인중개사 정보 없음';
      riskFactors.push({
        fieldName: '공인중개사',
        fieldValue: currentType,
        riskLevel: 'MEDIUM',
        description: `중개업자 종별이 "공인중개사"이 아닙니다. (현재: ${currentType})`,
        foundKeywords: ['공인중개사아님'],
      });
      keywordChecks.push({
        keyword: '공인중개사',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('중개업자 종별이 "공인중개사"인지 확인하세요.');
    }

    // 6. 직위구분명이 "대표"인 지
    if (brokerData.ofcpsSeCodeNm === '대표') {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '대표',
        passed: true,
        foundCount: 1,
      });
    } else {
      const currentPosition = brokerData.ofcpsSeCodeNm || '직위 정보 없음';
      riskFactors.push({
        fieldName: '직위구분',
        fieldValue: currentPosition,
        riskLevel: 'LOW',
        description: `직위가 "대표"가 아닙니다. (현재: ${currentPosition})`,
        foundKeywords: ['대표아님'],
      });
      keywordChecks.push({
        keyword: '대표',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('직위가 "대표"인지 확인하세요.');
    }

    // 위험도 레벨 결정
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (passedKeywords >= 5) {
      riskLevel = 'LOW';
      recommendations.push('전반적으로 안전한 중개업자로 판단됩니다.');
    } else if (passedKeywords >= 3) {
      riskLevel = 'MEDIUM';
      recommendations.push('일반적인 수준의 중개업자입니다.');
    } else {
      riskLevel = 'HIGH';
      recommendations.push('추가적인 확인이 권장됩니다.');
    }

    return {
      stepNumber: 1,
      riskLevel,
      riskFactors,
      totalRiskScore: Math.round(
        (passedKeywords / BROKER_SAFETY_KEYWORDS.length) * 100
      ),
      recommendations,
      keywordChecks,
      totalKeywords: BROKER_SAFETY_KEYWORDS.length,
      passedKeywords,
    };
  }, [brokerData, userInputName, userInputBusinessName]);
};
