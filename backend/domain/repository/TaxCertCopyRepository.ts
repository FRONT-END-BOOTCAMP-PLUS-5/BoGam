import { TaxCertCopyEntity } from '@be/domain/entities/TaxCertCopy';
import { CheckTaxCertCopyExistsResponseDto } from '@be/applications/taxCertCopies/dtos/CheckTaxCertCopyExistsResponseDto';

export interface TaxCertCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<TaxCertCopyEntity | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { taxCertData: string }
  ): Promise<TaxCertCopyEntity>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<CheckTaxCertCopyExistsResponseDto, 'exists' | 'updatedAt'>>;
}
