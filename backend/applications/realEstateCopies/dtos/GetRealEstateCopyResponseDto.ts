import { RealEstateCopyJson } from './RealEstateCopyJson';

/**
 * 등기부등본 복사본 조회 응답 DTO
 */
export interface GetRealEstateCopyResponseDto {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    userAddressId: number;
    realEstateJson: RealEstateCopyJson;
    updatedAt: Date;
  };
  error?: string;
}
