import { TaxCert } from '../entities/TaxCert';

export interface TaxCertCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<TaxCert[]>;
  upsertByUserAddressId(userAddressId: number, data: { taxCertData: string }): Promise<TaxCert>;
} 