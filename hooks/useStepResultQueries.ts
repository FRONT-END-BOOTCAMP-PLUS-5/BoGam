import { useQuery } from '@tanstack/react-query';
import stepResultQueryApi, { StepResultData } from '@libs/api_front/stepResultQueries.api';

interface GetStepResultParams {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
}

export const useGetStepResult = (params: GetStepResultParams) => {
  const { data, isLoading, isError } = useQuery<StepResultData | StepResultData[]>({
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
