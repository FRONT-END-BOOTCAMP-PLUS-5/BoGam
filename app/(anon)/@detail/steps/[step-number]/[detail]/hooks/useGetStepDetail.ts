import { useQuery } from '@tanstack/react-query';
import stepDetailApi, { StepDetailData } from '@libs/api_front/step.api';

interface GetStepDetailParams {
  stepNumber: string;
  detail: string;
  userAddressNickname: string;
}

export const useGetStepDetail = (params: GetStepDetailParams) => {
  const { data, isLoading, isError } = useQuery<StepDetailData>({
    queryKey: [
      'stepDetail',
      params.stepNumber,
      params.detail,
      params.userAddressNickname,
    ],
    queryFn: () => stepDetailApi.getStepDetail(params),
    enabled: !!(
      params.stepNumber &&
      params.detail &&
      params.userAddressNickname
    ),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
  return { data, isLoading, isError };
};
