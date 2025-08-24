import { useQuery } from '@tanstack/react-query';
import { loadRiskAssessmentAPI } from '@libs/api_front/riskAssessment.api';
import {
  RiskAssessmentJsonData,
  convertJsonToRiskAssessment,
} from '@utils/riskAssessmentUtils';

interface LoadRiskAssessmentParams {
  stepNumber: number;
  detail: number;
  userAddressNickname: string;
  domain?: 'realEstate' | 'broker' | 'taxCert';
}

interface LoadRiskAssessmentResult {
  success: boolean;
  data?: {
    jsonData: RiskAssessmentJsonData;
    domain: 'realEstate' | 'broker' | 'taxCert';
    savedAt: string;
  };
  error?: string;
}

export const useRiskAssessmentLoad = (params: LoadRiskAssessmentParams) => {
  const queryResult = useQuery<LoadRiskAssessmentResult['data'] | null>({
    queryKey: [
      'stepResults',
      params.userAddressNickname,
      params.stepNumber,
      params.detail,
    ],
    queryFn: async (): Promise<LoadRiskAssessmentResult['data'] | null> => {
      try {
        // API 요청
        const result = await loadRiskAssessmentAPI({
          userAddressNickname: params.userAddressNickname,
          stepNumber: params.stepNumber,
          detail: params.detail,
        });

        if (!result.success) {
          throw new Error(
            result.error || '데이터 조회 중 오류가 발생했습니다.'
          );
        }

        // JSON 데이터 추출 - 다양한 데이터 구조 처리
        let stepResult = result.data;

        // stepResult가 배열인 경우 첫 번째 항목 사용
        if (Array.isArray(stepResult)) {
          stepResult = stepResult[0];
        }

        // stepResult가 객체가 아니거나 details가 없는 경우
        if (
          !stepResult ||
          typeof stepResult !== 'object' ||
          !('details' in stepResult)
        ) {
          console.log('❌ step_result에 저장된 위험도 검사 데이터가 없습니다.');
          throw new Error('저장된 위험도 검사 데이터가 없습니다.');
        }

        const details = (stepResult as { details: unknown }).details;
        if (!details || typeof details !== 'object') {
          throw new Error('위험도 검사 데이터 형식이 올바르지 않습니다.');
        }

        // jsonDetails 없이 직접 위험도 검사 데이터 사용
        const loadResult = {
          jsonData: details as RiskAssessmentJsonData,
          domain: (params.domain || 'realEstate') as
            | 'realEstate'
            | 'broker'
            | 'taxCert',
          savedAt: new Date().toISOString(),
        };

        return loadResult;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!(
      params.userAddressNickname &&
      params.stepNumber &&
      params.detail
    ),
    retry: 2, // 실패 시 2번 재시도
    retryDelay: 1000, // 1초 후 재시도
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  return {
    loadRiskAssessment: queryResult.refetch,
    data: queryResult.data,
    error: queryResult.error?.message || null,
    isLoading: queryResult.isLoading,
    invalidateCache: queryResult.refetch, // refetch를 사용하여 캐시 무효화
  };
};
