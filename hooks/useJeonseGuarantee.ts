import { useMutation } from '@tanstack/react-query';
import {
  getJeonseGuarantee,
  GetJeonseGuaranteeRequestDto,
} from '@libs/api_front/jeonseGuarantee.api';

// React Query Hook
export const useGetJeonseGuarantee = () => {
  return useMutation({
    mutationFn: getJeonseGuarantee,
    onSuccess: (data) => {
      console.log('전세자금보증상품 조회 성공:', data);
    },
    onError: (error) => {
      console.error('전세자금보증상품 조회 실패:', error);
    },
  });
};
