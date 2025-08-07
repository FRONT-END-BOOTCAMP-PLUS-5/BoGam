import { TaxCertCopy } from '@be/domain/entities/TaxCertCopy';

export interface TaxCertCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<TaxCertCopy | null>;
  upsertByUserAddressId(userAddressId: number, data: { taxCertData: string }): Promise<TaxCertCopy>;
} 