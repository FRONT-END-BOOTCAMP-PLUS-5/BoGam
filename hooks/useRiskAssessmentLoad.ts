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

        // JSON 데이터 추출
        const stepResult = result.data as { details?: unknown };
        if (!stepResult || !stepResult.details) {
          throw new Error('저장된 위험도 검사 데이터가 없습니다.');
        }

        const details = stepResult.details;
        if (!details || typeof details !== 'object') {
          throw new Error('위험도 검사 데이터 형식이 올바르지 않습니다.');
        }

        // jsonDetails 없이 직접 위험도 검사 데이터 사용
        return {
          jsonData: details as RiskAssessmentJsonData,
          domain: 'realEstate', // 기본값으로 설정 (실제로는 URL에서 추출 가능)
          savedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error('위험도 검사 데이터 로드 실패:', error);
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
