import { TaxCertJson } from '@be/domain/entities/TaxCert';

/**
 * 납세확인서 복사본 조회 응답 DTO
 */
export interface GetTaxCertCopyResponseDto {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    userAddressId: number;
    taxCertJson: TaxCertJson;
    updatedAt: Date;
  };
  error?: string;
}
