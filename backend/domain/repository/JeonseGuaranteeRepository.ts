import { JeonseGuaranteeEntity } from '@be/domain/entities/JeonseGuarantee';
import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';

export interface JeonseGuaranteeRepository {
  /**
   * 전세자금보증상품 조회
   * @param params 조회 파라미터
   * @returns 전세자금보증상품 정보
   */
  getJeonseGuarantee(
    params: GetJeonseGuaranteeRequestDto
  ): Promise<JeonseGuaranteeEntity>;
}
