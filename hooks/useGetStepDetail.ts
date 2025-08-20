import { useQuery } from '@tanstack/react-query';
import stepDetailApi, { StepDetailData } from '@libs/api_front/step.api';

interface GetStepDetailParams {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
}

export const useGetStepDetail = (params: GetStepDetailParams) => {
  const { data, isLoading, isError } = useQuery<StepDetailData>({
    queryKey: [
      'stepDetail',
      params.userAddressNickname,
      params.stepNumber,
      params.detail,
    ],
    queryFn: () => stepDetailApi.getStepDetail(params),
    enabled: !!(
      params.userAddressNickname &&
      params.stepNumber &&
      params.detail
    ),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
  
  return { data, isLoading, isError };
};
