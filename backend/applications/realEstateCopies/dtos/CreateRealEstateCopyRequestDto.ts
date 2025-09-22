import { RealEstateCopyJson } from './RealEstateCopyJson';

/**
 * 등기부등본 복사본 생성/수정 요청 DTO
 */
export interface CreateRealEstateCopyRequestDto {
  userAddressId: number;
  realEstateJson: RealEstateCopyJson;
}
