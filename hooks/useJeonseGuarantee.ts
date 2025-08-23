import { useMutation } from '@tanstack/react-query';
import { getJeonseGuarantee } from '@libs/api_front/jeonseGuarantee.api';
import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';
import { GetJeonseGuaranteeResponseDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeResponseDto';

/**
 * 전세자금보증상품 조회 Hook
 * React Query를 사용하여 API 호출 상태 관리
 */
export const useJeonseGuarantee = () => {
  return useMutation<
    GetJeonseGuaranteeResponseDto,
    Error,
    GetJeonseGuaranteeRequestDto
  >({
    mutationFn: getJeonseGuarantee,
    onError: (error) => {
      console.error('전세자금보증상품 조회 실패:', error);
    },
  });
};
