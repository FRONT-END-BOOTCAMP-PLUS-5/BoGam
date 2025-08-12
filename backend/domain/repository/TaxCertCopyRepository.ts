import { TaxCertCopy } from '@be/domain/entities/TaxCertCopy';
import { CheckTaxCertCopyExistsResponseDto } from '@be/applications/taxCertCopies/dtos/CheckTaxCertCopyExistsResponseDto';

export interface TaxCertCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<TaxCertCopy | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { taxCertData: string }
  ): Promise<TaxCertCopy>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<CheckTaxCertCopyExistsResponseDto, 'exists' | 'updatedAt'>>;
}
