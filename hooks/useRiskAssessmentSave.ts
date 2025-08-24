import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveRiskAssessmentAPI } from '@libs/api_front/riskAssessment.api';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';

interface SaveRiskAssessmentParams {
  stepNumber: number;
  detail: number;
  jsonData: RiskAssessmentJsonData;
  domain: 'realEstate' | 'broker' | 'taxCert';
  userAddressNickname: string;
}

interface SaveRiskAssessmentResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export const useRiskAssessmentSave = (
  onSuccess?: (data: SaveRiskAssessmentResult) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<SaveRiskAssessmentResult, Error, SaveRiskAssessmentParams>(
    {
      mutationFn: async (
        params: SaveRiskAssessmentParams
      ): Promise<SaveRiskAssessmentResult> => {
        try {
          // API 요청
          const result = await saveRiskAssessmentAPI(params);

          if (!result.success) {
            throw new Error(result.error || '저장 중 오류가 발생했습니다.');
          }

          return {
            success: true,
            data: result.data,
          };
        } catch (error) {
          throw error;
        }
      },
      onSuccess: (data, variables) => {
        // 성공 시 관련 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: [
            'stepResults',
            variables.userAddressNickname,
            variables.stepNumber,
            variables.detail,
          ],
        });

        // 콜백 실행
        if (onSuccess) {
          onSuccess(data);
        }
      },
      retry: 2, // 실패 시 2번 재시도
      retryDelay: 1000, // 1초 후 재시도
    }
  );
};
