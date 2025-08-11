import { TaxCertJson } from '@be/domain/entities/TaxCert';

export interface TaxCertCopyExistsResponseDto {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  error?: string;
}

export interface TaxCertCopyDetailResponseDto {
  success: boolean;
  data?: {
    id: number;
    userAddressId: number;
    taxCertJson: TaxCertJson;
    updatedAt: Date;
  };
  error?: string;
}
