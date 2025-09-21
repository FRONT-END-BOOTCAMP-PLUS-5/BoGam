import { useMutation } from '@tanstack/react-query';
import {
  getGuaranteeLimit,
  GetGuaranteeLimitRequestDto,
} from '@libs/api_front/guaranteeLimit.api';

// React Query Hook
export const useGetGuaranteeLimit = () => {
  return useMutation({
    mutationFn: getGuaranteeLimit,
    onSuccess: (data) => {
      console.log('전세자금보증상품 조회 성공:', data);
    },
    onError: (error) => {
      console.error('전세자금보증상품 조회 실패:', error);
    },
  });
};
