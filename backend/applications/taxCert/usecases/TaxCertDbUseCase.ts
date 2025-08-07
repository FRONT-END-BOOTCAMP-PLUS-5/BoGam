import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCertJson } from '@be/domain/entities/TaxCert';
import { TaxCertCopy } from '@be/domain/entities/TaxCertCopy';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

/**
 * 납세확인서 DB CRUD UseCase
 * 클린 아키텍처의 Application 레이어
 * DB 조작 비즈니스 로직을 담당하며 Repository를 통해 데이터 접근
 */
export class TaxCertDbUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; taxCertJson: TaxCertJson; updatedAt?: Date; } | null> {
    const taxCert = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    
    if (!taxCert) return null;
    
    // 복호화 처리
    return {
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertJson: decryptJson(taxCert.taxCertData) as TaxCertJson,
      updatedAt: taxCert.updatedAt
    };
  }

  async upsertTaxCert(data: { userAddressId: number; taxCertJson: TaxCertJson }): Promise<{ id: number; userAddressId: number; taxCertJson: TaxCertJson; updatedAt?: Date; }> {
    // JSON을 암호화된 문자열로 변환
    const encryptedData = encryptJson(data.taxCertJson);
    
    // Prisma upsert 사용
    const result = await this.taxCertCopyRepository.upsertByUserAddressId(data.userAddressId, {
      taxCertData: encryptedData
    });
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      id: result.id,
      userAddressId: result.userAddressId,
      taxCertJson: decryptJson(result.taxCertData) as TaxCertJson,
      updatedAt: result.updatedAt
    };
  }
} 