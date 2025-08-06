import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto } from '@be/domain/entities/TaxCert';

export class TaxCertUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertsByUserAddressId(userAddressId: number): Promise<TaxCert[]> {
    return await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
  }

  async updateTaxCert(userAddressId: number, data: UpdateTaxCertDto): Promise<TaxCert> {
    return await this.taxCertCopyRepository.updateByUserAddressId(userAddressId, data);
  }

  async deleteTaxCert(userAddressId: number): Promise<void> {
    await this.taxCertCopyRepository.deleteByUserAddressId(userAddressId);
  }

  async findTaxCertByUserAddressId(userAddressId: number): Promise<TaxCert | null> {
    const taxCerts = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    return taxCerts.length > 0 ? taxCerts[0] : null;
  }

  async upsertTaxCert(data: CreateTaxCertDto): Promise<TaxCert> {
    const existing = await this.findTaxCertByUserAddressId(data.userAddressId);
    
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      return await this.taxCertCopyRepository.updateByUserAddressId(data.userAddressId, {
        taxCertJson: data.taxCertJson
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      return await this.taxCertCopyRepository.create(data);
    }
  }
} 