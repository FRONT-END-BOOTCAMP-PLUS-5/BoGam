import { RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';

export interface RealEstateCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  error?: string;
}

export interface RealEstateCopyDetailResponseDto {
  success: boolean;
  data?: {
    id: number;
    userAddressId: number;
    realEstateJson: RealEstateCopyJson;
    updatedAt: Date;
  };
  error?: string;
}
