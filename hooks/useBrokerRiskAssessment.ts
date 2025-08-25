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
  status: 'unchecked' | 'match' | 'mismatch'; // status 속성 추가
}

export interface BrokerChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  description: string;
}

export interface BrokerRiskAssessmentResult {
  stepNumber: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: BrokerRiskFactor[];
  totalRiskScore: number;
  recommendations: string[];
  keywordChecks: BrokerKeywordCheck[];
  checklistItems: BrokerChecklistItem[];
  totalKeywords: number;
  passedKeywords: number;
  totalChecklistItems: number;
  checkedItems: number;
}

// 중개업자 안전도 검사 키워드 정의 (키워드 방식)
const BROKER_SAFETY_KEYWORDS = [
  '중개업자 등록',
  '등록번호',
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
          status: 'unchecked',
        })),
        checklistItems: [],
        totalKeywords: BROKER_SAFETY_KEYWORDS.length,
        passedKeywords: 0,
        totalChecklistItems: 0,
        checkedItems: 0,
      };
    }

    const riskFactors: BrokerRiskFactor[] = [];
    let passedKeywords = 0;
    const keywordChecks: BrokerKeywordCheck[] = [];
    const checklistItems: BrokerChecklistItem[] = [];
    const recommendations: string[] = [];
    const checkedItems = 0; // 체크리스트는 기본적으로 0개 통과

    // 1. 사용자가 입력한 이름으로 API를 조회 했을 때 data가 있는 지
    if (brokerData.brkrNm) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '중개업자 등록',
        passed: true,
        foundCount: 1,
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
      });
      recommendations.push('중개업자 등록 여부를 반드시 확인하세요.');
    }

    // 2. 사업자 상호 체크리스트 항목
    const hasBusinessName = !!brokerData.bsnmCmpnm;
    checklistItems.push({
      id: 'business-name',
      label: '사업자 상호',
      checked: false, // 기본 상태는 mismatch
      description: '사업자 상호 정보가 등록되어 있는지 확인',
    });
    // 체크리스트는 기본적으로 checkedItems에 포함하지 않음

    // 3. 등록번호가 있는 지
    if (brokerData.jurirno) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '등록번호',
        passed: true,
        foundCount: 1,
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
      });
      recommendations.push('중개업자 등록번호를 반드시 확인하세요.');
    }

    // 4. 자격증 번호 체크리스트 항목
    const hasLicenseNumber = !!brokerData.crqfcNo;
    checklistItems.push({
      id: 'license-number',
      label: '자격증 번호',
      checked: false, // 기본 상태는 mismatch
      description: '중개업자 자격증번호가 등록되어 있는지 확인',
    });
    // 체크리스트는 기본적으로 checkedItems에 포함하지 않음

    // 5. 중개업자종별명이 "공인중개사"인 지
    if (brokerData.brkrAsortCodeNm === '공인중개사') {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '공인중개사',
        passed: true,
        foundCount: 1,
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
      checklistItems,
      totalKeywords: BROKER_SAFETY_KEYWORDS.length,
      passedKeywords,
      totalChecklistItems: checklistItems.length,
      checkedItems,
    };
  }, [brokerData, userInputName, userInputBusinessName]);
};
