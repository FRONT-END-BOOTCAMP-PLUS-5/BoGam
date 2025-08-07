import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto, TaxCertJson } from '@be/domain/entities/TaxCert';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

export class TaxCertUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertsByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; taxCertJson: TaxCertJson; updatedAt?: Date; }[]> {
    const taxCerts = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    
    // 복호화 처리
    return taxCerts.map(cert => ({
      id: cert.id,
      userAddressId: cert.userAddressId,
      taxCertJson: decryptJson(cert.taxCertData) as TaxCertJson,
      updatedAt: cert.updatedAt
    }));
  }

  async findTaxCertByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; taxCertJson: TaxCertJson; updatedAt?: Date; } | null> {
    const taxCerts = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    if (taxCerts.length === 0) return null;
    
    const cert = taxCerts[0];
    return {
      id: cert.id,
      userAddressId: cert.userAddressId,
      taxCertJson: decryptJson(cert.taxCertData) as TaxCertJson,
      updatedAt: cert.updatedAt
    };
  }

  async upsertTaxCert(data: { userAddressId: number; taxCertJson: TaxCertJson }): Promise<{ id: number; userAddressId: number; taxCertJson: TaxCertJson; updatedAt?: Date; }> {
    // JSON을 암호화된 문자열로 변환
    const encryptedData: CreateTaxCertDto = {
      userAddressId: data.userAddressId,
      taxCertData: encryptJson(data.taxCertJson)
    };
    
    const existingEncrypted = await this.taxCertCopyRepository.findByUserAddressId(data.userAddressId);
    const existing = existingEncrypted.length > 0 ? existingEncrypted[0] : null;
    
    let result: TaxCert;
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      result = await this.taxCertCopyRepository.updateByUserAddressId(data.userAddressId, {
        taxCertData: encryptedData.taxCertData
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      result = await this.taxCertCopyRepository.create(encryptedData);
    }
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      id: result.id,
      userAddressId: result.userAddressId,
      taxCertJson: decryptJson(result.taxCertData) as TaxCertJson,
      updatedAt: result.updatedAt
    };
  }
} 