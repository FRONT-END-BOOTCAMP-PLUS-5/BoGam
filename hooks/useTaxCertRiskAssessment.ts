import { useMemo } from 'react';

export interface TaxCertData {
  resIssueNo?: string;
  resIssueDate?: string;
  resIssueOgzNm?: string;
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
  resArrearsList?: Array<{
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
  status: 'unchecked' | 'match' | 'mismatch'; // status 속성 추가
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
          status: 'unchecked',
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
    const isPaymentTaxStatusValid =
      taxCertData.resPaymentTaxStatus === '해당없음';

    if (isPaymentTaxStatusValid) {
      passedKeywords += 1;
      keywordChecks.push({
        keyword: '납세상태 해당없음',
        passed: true,
        foundCount: 1,
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
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
        status: 'unchecked', // 사용자가 확인해야 하므로 초기값은 unchecked
      });
      recommendations.push('납세상태를 반드시 확인하세요.');
    }

    // 2. 체크리스트 항목들
    // 2-1. 납세자명과 임대인 명 일치 여부
    const nameMatch =
      userInputName &&
      taxCertData.resUserNm &&
      userInputName.trim() === taxCertData.resUserNm.trim();

    const nameMatchChecked =
      checklistState?.['서류와 임대인의 이름 일치 여부'] !== undefined
        ? checklistState['서류와 임대인의 이름 일치 여부']
        : nameMatch || false;

    checklistItems.push({
      id: '서류와 임대인의 이름 일치 여부',
      label: '납세자명과 임대인 명 일치 여부',
      checked: nameMatchChecked,
      description: '납세증명서의 납세자명과 실제 임대인 명이 일치하는지 확인',
    });
    if (nameMatchChecked) checkedItems++;

    // 2-2. 체납 내역 확인
    const hasArrearsList =
      taxCertData.resArrearsList && taxCertData.resArrearsList.length > 0;
    const arrearsChecked =
      checklistState?.['미납 내역 없음'] !== undefined
        ? checklistState['미납 내역 없음']
        : !hasArrearsList || false;

    checklistItems.push({
      id: '미납 내역 없음',
      label: '체납 내역 확인',
      checked: arrearsChecked,
      description: '체납 내역이 없는지 확인 (체납 내역이 있으면 위험)',
    });
    if (arrearsChecked) checkedItems++;

    // 2-3. 유효기간 만료일 확인
    const validPeriod = taxCertData.resValidPeriod;
    const isValidPeriod = validPeriod && validPeriod.length === 8;
    let isNotExpired = false;

    if (isValidPeriod) {
      const validDate = new Date(
        parseInt(validPeriod.substring(0, 4)),
        parseInt(validPeriod.substring(4, 6)) - 1,
        parseInt(validPeriod.substring(6, 8))
      );
      const today = new Date();
      isNotExpired = validDate > today;
    }

    const expiryChecked =
      checklistState?.['유효기간 만료일 확인'] !== undefined
        ? checklistState['유효기간 만료일 확인']
        : isNotExpired || false;

    checklistItems.push({
      id: '유효기간 만료일 확인',
      label: '유효기간 만료일 확인',
      checked: expiryChecked,
      description: '납세증명서 유효기간이 만료되지 않았는지 확인',
    });
    if (expiryChecked) checkedItems++;

    // 2-5. 발급일자 최신성 확인
    const issueDate = taxCertData.resIssueDate;
    const isValidIssueDate = issueDate && issueDate.length === 8;
    let isRecentIssue = false;

    if (isValidIssueDate) {
      const issueDateObj = new Date(
        parseInt(issueDate.substring(0, 4)),
        parseInt(issueDate.substring(4, 6)) - 1,
        parseInt(issueDate.substring(6, 8))
      );
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - issueDateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isRecentIssue = diffDays <= 30; // 30일 이내 발급
    }

    const recentIssueChecked =
      checklistState?.['발급일자 최신성 확인'] !== undefined
        ? checklistState['발급일자 최신성 확인']
        : isRecentIssue || false;

    checklistItems.push({
      id: '발급일자 최신성 확인',
      label: '발급일자 최신성 확인',
      checked: recentIssueChecked,
      description: '납세증명서가 최근 30일 이내에 발급되었는지 확인',
    });
    if (recentIssueChecked) checkedItems++;

    // 2-2. 유예 관련 체크리스트 항목들 (resRespiteList가 있을 때만)
    const hasRespiteList =
      taxCertData.resRespiteList && taxCertData.resRespiteList.length > 0;

    if (hasRespiteList) {
      // 2-2-1. 유예 종류 확인
      const hasRespiteType = taxCertData.resRespiteList!.some(
        (item) => item.resRespiteType
      );
      const respiteTypeChecked =
        checklistState?.['유예 종류 확인'] !== undefined
          ? checklistState['유예 종류 확인']
          : hasRespiteType || false;

      checklistItems.push({
        id: '유예 종류 확인',
        label: '유예 종류 확인',
        checked: respiteTypeChecked,
        description:
          '징수유예등 또는 체납처분유예의 종류가 명시되어 있는지 확인',
      });
      if (respiteTypeChecked) checkedItems++;

      // 2-2-2. 유예 기간 확인
      const hasRespitePeriod = taxCertData.resRespiteList!.some(
        (item) => item.resRespitePeriod
      );
      const respitePeriodChecked =
        checklistState?.['유예 기간 확인'] !== undefined
          ? checklistState['유예 기간 확인']
          : hasRespitePeriod || false;

      checklistItems.push({
        id: '유예 기간 확인',
        label: '유예 기간 확인',
        checked: respitePeriodChecked,
        description:
          '징수유예등 또는 체납처분유예의 기간이 명시되어 있는지 확인',
      });
      if (respitePeriodChecked) checkedItems++;

      // 2-2-3. 납부기한 확인
      const hasPaymentDeadline = taxCertData.resRespiteList!.some(
        (item) => item.resPaymentDeadline
      );
      const paymentDeadlineChecked =
        checklistState?.['납부기한 확인'] !== undefined
          ? checklistState['납부기한 확인']
          : hasPaymentDeadline || false;

      checklistItems.push({
        id: '납부기한 확인',
        label: '체납 리스트에서 납부기한 확인',
        checked: paymentDeadlineChecked,
        description: '체납 리스트에서 납부기한이 명시되어 있는지 확인',
      });
      if (paymentDeadlineChecked) checkedItems++;

      // 2-2-4. 지방세액 천만원 이하 확인
      const isTaxAmountUnder10M = taxCertData.resRespiteList!.every((item) => {
        const taxAmount = parseFloat(item.resLocalTaxAmt || '0');
        return taxAmount <= 10000000; // 천만원
      });
      const taxAmountChecked =
        checklistState?.['지방세액 천만원 이하 확인'] !== undefined
          ? checklistState['지방세액 천만원 이하 확인']
          : isTaxAmountUnder10M || false;

      checklistItems.push({
        id: '지방세액 천만원 이하 확인',
        label: '지방세액이 천만원 이하인 지 확인',
        checked: taxAmountChecked,
        description: '모든 체납 항목의 지방세액이 천만원 이하인지 확인',
      });
      if (taxAmountChecked) checkedItems++;
    }

    // 안전도 검사 기준: 키워드 + 체크리스트 항목의 총합
    const totalKeywords = keywordChecks.length;
    const totalChecklistItems = checklistItems.length;
    const totalItems = passedKeywords + checkedItems;
    const maxItems = totalKeywords + totalChecklistItems;

    // 위험도 레벨 결정 (80% 이상: LOW, 60% 이상: MEDIUM, 그 이하: HIGH)
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    const safetyPercentage = maxItems > 0 ? (totalItems / maxItems) * 100 : 0;

    if (safetyPercentage >= 80) {
      riskLevel = 'LOW';
      recommendations.push('전반적으로 안전한 납세증명서로 판단됩니다.');
    } else if (safetyPercentage >= 60) {
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
      totalRiskScore: Math.round(safetyPercentage),
      recommendations,
      keywordChecks,
      checklistItems,
      totalKeywords,
      passedKeywords,
      totalChecklistItems,
      checkedItems,
    };
  }, [taxCertData, userInputName, checklistState]);
};
