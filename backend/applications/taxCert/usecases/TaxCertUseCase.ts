import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto } from '@be/domain/entities/TaxCert';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

export class TaxCertUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertsByUserAddressId(userAddressId: number): Promise<TaxCert[]> {
    const taxCerts = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    
    // 복호화 처리
    return taxCerts.map(cert => ({
      ...cert,
      taxCertJson: this.decryptTaxCertJson(cert.taxCertJson)
    }));
  }

  async updateTaxCert(userAddressId: number, data: UpdateTaxCertDto): Promise<TaxCert> {
    // 업데이트할 데이터가 있으면 암호화
    const encryptedData = data.taxCertJson ? {
      ...data,
      taxCertJson: this.encryptTaxCertJson(data.taxCertJson)
    } : data;
    
    const result = await this.taxCertCopyRepository.updateByUserAddressId(userAddressId, encryptedData);
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      ...result,
      taxCertJson: this.decryptTaxCertJson(result.taxCertJson)
    };
  }

  async deleteTaxCert(userAddressId: number): Promise<void> {
    await this.taxCertCopyRepository.deleteByUserAddressId(userAddressId);
  }

  async findTaxCertByUserAddressId(userAddressId: number): Promise<TaxCert | null> {
    const taxCerts = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    if (taxCerts.length === 0) return null;
    
    const cert = taxCerts[0];
    return {
      ...cert,
      taxCertJson: this.decryptTaxCertJson(cert.taxCertJson)
    };
  }

  async upsertTaxCert(data: CreateTaxCertDto): Promise<TaxCert> {
    // 암호화된 데이터로 변환
    const encryptedData = {
      ...data,
      taxCertJson: this.encryptTaxCertJson(data.taxCertJson)
    };
    
    const existingEncrypted = await this.taxCertCopyRepository.findByUserAddressId(data.userAddressId);
    const existing = existingEncrypted.length > 0 ? existingEncrypted[0] : null;
    
    let result: TaxCert;
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      result = await this.taxCertCopyRepository.updateByUserAddressId(data.userAddressId, {
        taxCertJson: encryptedData.taxCertJson
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      result = await this.taxCertCopyRepository.create(encryptedData);
    }
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      ...result,
      taxCertJson: this.decryptTaxCertJson(result.taxCertJson)
    };
  }

  // 암호화 헬퍼 메서드
  private encryptTaxCertJson(taxCertJson: Record<string, unknown>): Record<string, unknown> {
    try {
      const encryptedString = encryptJson(taxCertJson);
      return { encrypted: encryptedString };
    } catch (error) {
      console.error('납세증명서 JSON 암호화 실패:', error);
      throw new Error('납세증명서 데이터 암호화에 실패했습니다.');
    }
  }

  // 복호화 헬퍼 메서드
  private decryptTaxCertJson(taxCertJson: Record<string, unknown>): Record<string, unknown> {
    try {
      // 암호화된 데이터인지 확인
      if (typeof taxCertJson === 'object' && taxCertJson !== null && 'encrypted' in taxCertJson) {
        return decryptJson(taxCertJson.encrypted as string);
      }
      // 암호화되지 않은 기존 데이터는 그대로 반환 (하위 호환성)
      return taxCertJson;
    } catch (error) {
      console.error('납세증명서 JSON 복호화 실패:', error);
      throw new Error('납세증명서 데이터 복호화에 실패했습니다.');
    }
  }
} 