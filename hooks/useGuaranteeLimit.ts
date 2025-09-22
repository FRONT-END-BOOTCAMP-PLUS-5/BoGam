import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGuaranteeLimit,
  GetGuaranteeLimitRequestDto,
  guaranteeLimitCopyApi,
  GuaranteeLimitCopyExistsResponse,
  GuaranteeLimitCopyApiResponse,
  GuaranteeLimitApiResponse,
} from '@libs/api_front/guaranteeLimit.api';

// React Query Hook - 조회 및 DB 저장
export const useGetGuaranteeLimit = (
  onSuccess?: (data: GuaranteeLimitApiResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<GuaranteeLimitApiResponse, Error, GetGuaranteeLimitRequestDto>({
    mutationFn: getGuaranteeLimit,
    onSuccess: (data, variables) => {
      console.log('전세자금보증상품 조회 성공:', data);
      
      // 성공 시 관련 쿼리 무효화
      if (variables.userAddressNickname) {
        queryClient.invalidateQueries({
          queryKey: ['guaranteeLimitCopy', 'exists', variables.userAddressNickname],
        });
        queryClient.invalidateQueries({
          queryKey: ['guaranteeLimitCopy', variables.userAddressNickname],
        });
      }

      // 콜백 실행
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('전세자금보증상품 조회 실패:', error);
    },
  });
};

// 보증한도 복사본 존재 여부 확인
export const useCheckGuaranteeLimitCopyExists = (userAddressNickname: string | null) => {
  return useQuery<GuaranteeLimitCopyExistsResponse>({
    queryKey: ['guaranteeLimitCopy', 'exists', userAddressNickname],
    queryFn: (): Promise<GuaranteeLimitCopyExistsResponse> => 
      guaranteeLimitCopyApi.checkGuaranteeLimitCopyExists(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};

// 보증한도 복사본 조회
export const useGetGuaranteeLimitCopy = (userAddressNickname: string | null) => {
  return useQuery<GuaranteeLimitCopyApiResponse>({
    queryKey: ['guaranteeLimitCopy', userAddressNickname],
    queryFn: (): Promise<GuaranteeLimitCopyApiResponse> => 
      guaranteeLimitCopyApi.getGuaranteeLimitCopy({ userAddressNickname: userAddressNickname! }),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};

