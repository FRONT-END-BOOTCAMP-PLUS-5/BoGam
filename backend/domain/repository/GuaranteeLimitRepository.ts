import { GuaranteeLimitEntity } from '@be/domain/entities/GuaranteeLimit';
import { GetGuaranteeLimitRequestDto } from '@be/applications/guaranteeLimits/dtos/GetGuaranteeLimitRequestDto';

export interface GuaranteeLimitRepository {
  /**
   * 전세자금보증상품 조회
   * @param params 조회 파라미터
   * @returns 전세자금보증상품 정보
   */
  getGuaranteeLimit(
    params: GetGuaranteeLimitRequestDto
  ): Promise<GuaranteeLimitEntity>;
}
