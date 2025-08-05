import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto } from '@be/domain/entities/TaxCert';

export class TaxCertUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async createTaxCert(data: CreateTaxCertDto): Promise<TaxCert> {
    return await this.taxCertCopyRepository.create(data);
  }

  async getTaxCertsByUserAddressId(userAddressId: number): Promise<TaxCert[]> {
    return await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
  }

  async updateTaxCert(userAddressId: number, data: UpdateTaxCertDto): Promise<TaxCert> {
    return await this.taxCertCopyRepository.updateByUserAddressId(userAddressId, data);
  }

  async deleteTaxCert(userAddressId: number): Promise<void> {
    await this.taxCertCopyRepository.deleteByUserAddressId(userAddressId);
  }
} 