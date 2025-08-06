import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto } from '../entities/TaxCert';

export interface TaxCertCopyRepository {
  create(data: CreateTaxCertDto): Promise<TaxCert>;
  findByUserAddressId(userAddressId: number): Promise<TaxCert[]>;
  updateByUserAddressId(userAddressId: number, data: UpdateTaxCertDto): Promise<TaxCert>;
  deleteByUserAddressId(userAddressId: number): Promise<void>;
} 