import { TaxCertCopy } from '@be/domain/entities/TaxCertCopy';
import { TaxCertCopyExistsResponseDto } from '@be/applications/taxCertCopy/dtos/TaxCertCopyDto';

export interface TaxCertCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<TaxCertCopy | null>;
  upsertByUserAddressId(userAddressId: number, data: { taxCertData: string }): Promise<TaxCertCopy>;
  existsByUserAddressId(userAddressId: number): Promise<Pick<TaxCertCopyExistsResponseDto, 'exists' | 'updatedAt'>>;
} 