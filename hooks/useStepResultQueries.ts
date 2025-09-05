import { useQuery } from '@tanstack/react-query';
import stepResultQueryApi, { StepResultData } from '@libs/api_front/stepResultQueries.api';

// API 응답 데이터 타입 정의
interface StepResultResponseData {
  results: StepResultData[];
  summary: {
    totalMismatch: number;
    totalMatch: number;
    totalUnchecked: number;
    stepCount: number;
    stepNumber: number;
  };
}

interface GetStepResultParams {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
}

export const useGetStepResult = (params: GetStepResultParams) => {
  const { data, isLoading, isError } = useQuery<StepResultData | StepResultData[] | StepResultResponseData>({
    queryKey: [
      'stepResults',
      params.userAddressNickname,
      params.stepNumber,
      params.detail,
    ],
    queryFn: () => stepResultQueryApi.getStepResult(params),
    enabled: !!params.userAddressNickname,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
  
  return { data, isLoading, isError };
};
