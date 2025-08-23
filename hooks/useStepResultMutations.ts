import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stepResultsApi, StepResultRequest, StepResultResponse } from '@libs/api_front/stepResults.api';

export const useStepResultMutations = () => {
  const queryClient = useQueryClient();

  // Step Result 생성/수정 뮤테이션 (upsert)
  const upsertStepResult = useMutation({
    mutationFn: (data: StepResultRequest) => 
      stepResultsApi.upsertStepResult(data),
    onSuccess: (data: StepResultResponse) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['stepResults'] });
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
      
      // 콘솔에 성공 메시지 출력 (개발용)
      console.log('Step result saved successfully:', data.message);
    },
    onError: (error) => {
      console.error('Failed to save step result:', error);
    },
  });

  // 쿼리 중단 함수 (초기화 시 사용)
  const removeQueries = (nickname: string, stepNumber: number, detail: number) => {
    const queryKey = ['stepResults', nickname, String(stepNumber), String(detail)];
    queryClient.removeQueries({ queryKey });
  };

  return {
    upsertStepResult,
    removeQueries,
    isLoading: upsertStepResult.isPending,
    isError: upsertStepResult.isError,
    error: upsertStepResult.error,
  };
};
