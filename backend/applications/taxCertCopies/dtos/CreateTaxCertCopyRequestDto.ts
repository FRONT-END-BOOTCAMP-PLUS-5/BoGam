import { TaxCertJson } from '@be/domain/entities/TaxCert';

/**
 * 납세확인서 복사본 생성/수정 요청 DTO
 */
export interface CreateTaxCertCopyRequestDto {
  userAddressId: number;
  taxCertJson: TaxCertJson;
}
