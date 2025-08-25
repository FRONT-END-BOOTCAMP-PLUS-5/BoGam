import { useMemo } from 'react';
import { RealEstateEntity } from '@be/domain/entities/RealEstate';
import { DANGEROUS_KEYWORDS } from '@utils/constants/riskAssessment';

export interface RiskFactor {
  fieldName: string; // 필드명 (한글)
  fieldValue: string; // 필드 값
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  foundKeywords: string[];
}

export interface KeywordCheck {
  keyword: string;
  passed: boolean;
  foundCount: number;
  status: 'unchecked' | 'match' | 'mismatch'; // 미확인, 통과, 실패
}

export interface RiskAssessmentResult {
  stepNumber: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: RiskFactor[];
  totalRiskScore: number;
  recommendations: string[];
  keywordChecks: KeywordCheck[];
  totalKeywords: number;
  passedKeywords: number;
}

export const useRiskAssessment = (
  stepNumber: number,
  realEstateData: RealEstateEntity | null,
  additionalData?: unknown
): RiskAssessmentResult => {
  return useMemo(() => {
    if (!realEstateData) {
      return {
        stepNumber,
        riskLevel: 'LOW',
        riskFactors: [],
        totalRiskScore: 0,
        recommendations: ['등기부등본 데이터가 없습니다.'],
        keywordChecks: DANGEROUS_KEYWORDS.map((keyword) => ({
          keyword,
          passed: true,
          foundCount: 0,
          status: 'unchecked' as const,
        })),
        totalKeywords: DANGEROUS_KEYWORDS.length,
        passedKeywords: DANGEROUS_KEYWORDS.length,
      };
    }

    const riskFactors: RiskFactor[] = [];
    let totalRiskScore = 0;

    // 등기부등본 데이터를 JSON 문자열로 변환하여 전체 검색
    const fullDataString = JSON.stringify(realEstateData).toLowerCase();

    // 위험 키워드 검색
    const foundKeywords: string[] = [];
    DANGEROUS_KEYWORDS.forEach((keyword) => {
      if (fullDataString.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    // 각 필드별로 위험 키워드 검색
    const searchInField = (
      fieldName: string,
      fieldValue: unknown,
      displayName: string
    ) => {
      if (!fieldValue || typeof fieldValue !== 'string') return;

      const fieldString = fieldValue.toLowerCase();
      const foundInField: string[] = [];

      DANGEROUS_KEYWORDS.forEach((keyword) => {
        if (fieldString.includes(keyword.toLowerCase())) {
          foundInField.push(keyword);
        }
      });

      if (foundInField.length > 0) {
        const riskLevel =
          foundInField.length >= 3
            ? 'CRITICAL'
            : foundInField.length >= 2
            ? 'HIGH'
            : 'MEDIUM';

        riskFactors.push({
          fieldName: displayName,
          fieldValue: fieldValue,
          riskLevel,
          description: `위험 키워드 발견: ${foundInField.join(', ')}`,
          foundKeywords: foundInField,
        });

        totalRiskScore += foundInField.length * 25;
      }
    };

    // 주요 필드들 검사
    if (realEstateData.resRegisterEntriesList) {
      realEstateData.resRegisterEntriesList.forEach((entry, index) => {
        searchInField(
          'resDocTitle',
          entry.resDocTitle,
          `등기사항 ${index + 1} - 문서제목`
        );
        searchInField(
          'resRealty',
          entry.resRealty,
          `등기사항 ${index + 1} - 부동산명`
        );
        searchInField(
          'resPublishDate',
          entry.resPublishDate,
          `등기사항 ${index + 1} - 발행일자`
        );
        searchInField(
          'resPublishRegistryOffice',
          entry.resPublishRegistryOffice,
          `등기사항 ${index + 1} - 발행등기소`
        );
      });
    }

    // 주소 리스트 검사
    if (realEstateData.resAddrList) {
      realEstateData.resAddrList.forEach((addr, index) => {
        searchInField(
          'resUserNm',
          addr.resUserNm,
          `주소 ${index + 1} - 소유자명`
        );
        searchInField(
          'commAddrLotNumber',
          addr.commAddrLotNumber,
          `주소 ${index + 1} - 소재지번`
        );
        searchInField('resState', addr.resState, `주소 ${index + 1} - 상태`);
      });
    }

    // 기타 주요 필드들 검사
    searchInField(
      'resWarningMessage',
      realEstateData.resWarningMessage,
      '경고메시지'
    );
    searchInField('resPublishNo', realEstateData.resPublishNo, '발행번호');
    searchInField('resIssueYn', realEstateData.resIssueYn, '발급여부');

    // 키워드별 체크 결과 생성
    const keywordChecks: KeywordCheck[] = DANGEROUS_KEYWORDS.map((keyword) => {
      const foundCount = foundKeywords.filter((k) => k === keyword).length;
      const passed = foundCount === 0; // 위험 키워드를 발견하지 않으면 통과로 판단
      return {
        keyword,
        passed,
        foundCount,
        status: passed ? ('match' as const) : ('unchecked' as const), // 통과 또는 미확인
      };
    });



    const passedKeywords = keywordChecks.filter((check) => check.passed).length;

    // 전체 위험도 레벨 결정 (키워드 개수 기준)
    let overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    const failedKeywords = DANGEROUS_KEYWORDS.length - passedKeywords;

    if (failedKeywords >= 5) overallRiskLevel = 'CRITICAL';
    else if (failedKeywords >= 3) overallRiskLevel = 'HIGH';
    else if (failedKeywords >= 1) overallRiskLevel = 'MEDIUM';

    // 권장사항 생성
    const recommendations: string[] = [];
    if (foundKeywords.length > 0) {
      recommendations.push(
        `위험 키워드가 발견되었습니다: ${foundKeywords.join(', ')}`
      );
      recommendations.push('해당 부동산은 법적 위험이 있을 수 있습니다.');
      recommendations.push('전문가 상담을 권장합니다.');
    } else {
      recommendations.push('등기부등본에서 위험 요소가 발견되지 않았습니다.');
    }

    return {
      stepNumber,
      riskLevel: overallRiskLevel,
      riskFactors,
      totalRiskScore,
      recommendations,
      keywordChecks,
      totalKeywords: DANGEROUS_KEYWORDS.length,
      passedKeywords,
    };
  }, [stepNumber, realEstateData, additionalData]);
};
