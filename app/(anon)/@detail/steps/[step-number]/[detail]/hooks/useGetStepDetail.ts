import { useQuery } from '@tanstack/react-query';
import stepDetailApi, { StepDetailData } from '@libs/api_front/step.api';

interface GetStepDetailParams {
  stepNumber: string;
  detail: string;
  userAddressNickname: string;
}

export const useGetStepDetail = (params: GetStepDetailParams) => {
  // 테스트를 위한 mock 데이터
  const mockData: StepDetailData = {
    detailTitle: "테스트 상세 제목",
    isSafe: true,
    expandableTitle: "상세 정보 보기",
    details: [
      { key: "항목 1", value: "값 1" },
      { key: "항목 2", value: "값 2" },
      { key: "항목 3", value: "값 3" },
    ]
  };

  // API 호출 대신 mock 데이터 반환 (테스트용)
  return { 
    data: mockData, 
    isLoading: false, 
    isError: false 
  };

  // 실제 API 호출 코드 (주석 처리)
  /*
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
  */
};
