import { useMemo } from 'react';

export interface TaxCertData {
  resIssueNo?: string;
  resUserNm?: string;
  resUserAddr?: string;
  resUserIdentiyNo?: string;
  resPaymentTaxStatus?: string;
  resValidPeriod?: string;
  resRespiteList?: Array<{
    resRespiteType?: string;
    resRespitePeriod?: string;
    resTaxYear?: string;
    resTaxItemName?: string;
    resPaymentDeadline?: string;
    resLocalTaxAmt?: string;
    resAdditionalCharges?: string;
  }>;
  resOriGinalData1?: string;
}

export interface TaxCertRiskFactor {
  fieldName: string;
  fieldValue: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  foundKeywords: string[];
}

export interface TaxCertKeywordCheck {
  keyword: string;
  passed: boolean;
  foundCount: number;
}

export interface TaxCertChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  description: string;
}

export interface TaxCertRiskAssessmentResult {
  stepNumber: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: TaxCertRiskFactor[];
  totalRiskScore: number;
  recommendations: string[];
  keywordChecks: TaxCertKeywordCheck[];
  checklistItems: TaxCertChecklistItem[];
  totalKeywords: number;
  passedKeywords: number;
  totalChecklistItems: number;
  checkedItems: number;
}

// 납세증명서 안전도 검사 키워드 정의
const TAX_CERT_SAFETY_KEYWORDS = ['납세상태 해당없음'];

export const useTaxCertRiskAssessment = (
  taxCertData: TaxCertData | null,
  userInputName?: string,
  checklistState?: Record<string, boolean>
): TaxCertRiskAssessmentResult => {
  return useMemo(() => {
    console.log('useTaxCertRiskAssessment 재계산:', {
      taxCertData,
      userInputName,
      checklistState,
    });
    if (!taxCertData) {
      return {
        stepNumber: 1,
        riskLevel: 'HIGH',
        riskFactors: [],
        totalRiskScore: 0,
        recommendations: ['납세증명서 데이터가 없습니다.'],
        keywordChecks: TAX_CERT_SAFETY_KEYWORDS.map((keyword) => ({
          keyword,
          passed: false,
          foundCount: 0,
        })),
        checklistItems: [],
        totalKeywords: TAX_CERT_SAFETY_KEYWORDS.length,
        passedKeywords: 0,
        totalChecklistItems: 0,
        checkedItems: 0,
      };
    }

    const riskFactors: TaxCertRiskFactor[] = [];
    let passedKeywords = 0;
    const keywordChecks: TaxCertKeywordCheck[] = [];
    const recommendations: string[] = [];
    const checklistItems: TaxCertChecklistItem[] = [];
    let checkedItems = 0;

    // 1. 키워드 검사: 납세 상태가 "해당없음"인 지
    if (taxCertData.resPaymentTaxStatus === '해당없음') {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '납세상태 해당없음',
        passed: true,
        foundCount: 1,
      });
    } else {
      const currentStatus = taxCertData.resPaymentTaxStatus || '상태 정보 없음';
      riskFactors.push({
        fieldName: '납세상태',
        fieldValue: currentStatus,
        riskLevel: 'HIGH',
        description: `납세상태가 "해당없음"이 아닙니다. (현재: ${currentStatus})`,
        foundKeywords: ['납세상태이상'],
      });
      keywordChecks.push({
        keyword: '납세상태 해당없음',
        passed: false,
        foundCount: 0,
      });
      recommendations.push('납세상태를 반드시 확인하세요.');
    }

    // 2. 체크리스트 항목들
    // 2-1. 납세자명과 임대인 명 일치 여부 (사용자 입력 필요)
    const nameMatch =
      userInputName &&
      taxCertData.resUserNm &&
      userInputName.trim() === taxCertData.resUserNm.trim();

    const nameMatchChecked =
      checklistState?.['name-match'] !== undefined
        ? checklistState['name-match']
        : nameMatch || false;
    checklistItems.push({
      id: 'name-match',
      label: '납세자명과 임대인 명 일치 여부',
      checked: nameMatchChecked,
      description: '납세증명서의 납세자명과 실제 임대인 명이 일치하는지 확인',
    });
    if (nameMatchChecked) checkedItems++;

    // 2-2. 납세여부가 "해당없음"인 경우의 추가 체크 항목들
    if (taxCertData.resPaymentTaxStatus === '해당없음') {
      // 2-2-1. 유예 종류 확인
      const hasRespiteType =
        taxCertData.resRespiteList &&
        taxCertData.resRespiteList.some((item) => item.resRespiteType);

      const respiteTypeChecked =
        checklistState?.['respite-type'] !== undefined
          ? checklistState['respite-type']
          : hasRespiteType || false;
      checklistItems.push({
        id: 'respite-type',
        label: '유예 종류 확인',
        checked: respiteTypeChecked,
        description:
          '징수유예등 또는 체납처분유예의 종류가 명시되어 있는지 확인',
      });
      if (respiteTypeChecked) checkedItems++;

      // 2-2-2. 유예 기간 확인
      const hasRespitePeriod =
        taxCertData.resRespiteList &&
        taxCertData.resRespiteList.some((item) => item.resRespitePeriod);

      const respitePeriodChecked =
        checklistState?.['respite-period'] !== undefined
          ? checklistState['respite-period']
          : hasRespitePeriod || false;
      checklistItems.push({
        id: 'respite-period',
        label: '유예 기간 확인',
        checked: respitePeriodChecked,
        description:
          '징수유예등 또는 체납처분유예의 기간이 명시되어 있는지 확인',
      });
      if (respitePeriodChecked) checkedItems++;

      // 2-2-3. 체납 리스트에서 납부기한 확인
      const hasPaymentDeadline =
        taxCertData.resRespiteList &&
        taxCertData.resRespiteList.some((item) => item.resPaymentDeadline);

      const paymentDeadlineChecked =
        checklistState?.['payment-deadline'] !== undefined
          ? checklistState['payment-deadline']
          : hasPaymentDeadline || false;
      checklistItems.push({
        id: 'payment-deadline',
        label: '체납 리스트에서 납부기한 확인',
        checked: paymentDeadlineChecked,
        description: '체납 리스트에서 납부기한이 명시되어 있는지 확인',
      });
      if (paymentDeadlineChecked) checkedItems++;

      // 2-2-4. 지방세액이 천만원 이하인 지 확인
      const isTaxAmountUnder10M =
        taxCertData.resRespiteList &&
        taxCertData.resRespiteList.every((item) => {
          const taxAmount = parseFloat(item.resLocalTaxAmt || '0');
          return taxAmount <= 10000000; // 천만원
        });

      const taxAmountChecked =
        checklistState?.['tax-amount-under-10m'] !== undefined
          ? checklistState['tax-amount-under-10m']
          : isTaxAmountUnder10M || false;
      checklistItems.push({
        id: 'tax-amount-under-10m',
        label: '지방세액이 천만원 이하인 지 확인',
        checked: taxAmountChecked,
        description: '모든 체납 항목의 지방세액이 천만원 이하인지 확인',
      });
      if (taxAmountChecked) checkedItems++;
    }

    // 위험도 레벨 결정 (키워드 + 체크리스트 종합)
    const totalItems = passedKeywords + checkedItems;
    const maxItems = TAX_CERT_SAFETY_KEYWORDS.length + checklistItems.length;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (totalItems >= Math.floor(maxItems * 0.8)) {
      // 80% 이상
      riskLevel = 'LOW';
      recommendations.push('전반적으로 안전한 납세증명서로 판단됩니다.');
    } else if (totalItems >= Math.floor(maxItems * 0.6)) {
      // 60% 이상
      riskLevel = 'MEDIUM';
      recommendations.push('일반적인 수준의 납세증명서입니다.');
    } else {
      riskLevel = 'HIGH';
      recommendations.push('추가적인 확인이 권장됩니다.');
    }

    return {
      stepNumber: 1,
      riskLevel,
      riskFactors,
      totalRiskScore: Math.round((totalItems / maxItems) * 100),
      recommendations,
      keywordChecks,
      checklistItems,
      totalKeywords: TAX_CERT_SAFETY_KEYWORDS.length + checklistItems.length,
      passedKeywords: totalItems,
      totalChecklistItems: checklistItems.length,
      checkedItems,
    };
  }, [taxCertData, userInputName, checklistState]);
};
