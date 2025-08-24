import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';
import { GetJeonseGuaranteeResponseDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeResponseDto';
import { axiosInstance } from '@utils/axios';

/**
 * 전세자금보증상품 조회 API
 * @param params 조회 파라미터
 * @returns 전세자금보증상품 정보
 */
export const getJeonseGuarantee = async (
  params: GetJeonseGuaranteeRequestDto
): Promise<GetJeonseGuaranteeResponseDto> => {
  try {
    const response = await axiosInstance.post('/jeonse-guarantee', params);
    return response.data as GetJeonseGuaranteeResponseDto;
  } catch (error) {
    console.error('전세자금보증상품 조회 API 호출 중 오류:', error);
    throw error;
  }
};
