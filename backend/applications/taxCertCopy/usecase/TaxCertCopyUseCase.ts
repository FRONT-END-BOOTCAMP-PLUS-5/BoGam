import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCertJson } from '@be/domain/entities/TaxCert';
import { encryptJson, decryptJson } from '@utils/encryption';
import { TaxCertCopyExistsResponseDto, TaxCertCopyDetailResponseDto } from '../dtos/TaxCertCopyDto';

/**
 * 납세확인서 DB CRUD UseCase
 * 클린 아키텍처의 Application 레이어
 * DB 조작 비즈니스 로직을 담당하며 Repository를 통해 데이터 접근
 */
export class TaxCertCopyUseCase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertByUserAddressId(userAddressId: number): Promise<TaxCertCopyDetailResponseDto['data'] | null> {
    const taxCert = await this.taxCertCopyRepository.findByUserAddressId(userAddressId);
    
    if (!taxCert) return null;
    
    // 복호화 처리
    return {
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertJson: decryptJson(taxCert.taxCertData) as TaxCertJson,
      updatedAt: taxCert.updatedAt!
    };
  }

  async upsertTaxCert(data: { userAddressId: number; taxCertJson: TaxCertJson }): Promise<boolean> {
    try {
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(data.taxCertJson);
      
      // Prisma upsert 사용
      await this.taxCertCopyRepository.upsertByUserAddressId(data.userAddressId, {
        taxCertData: encryptedData
      });
      
      return true;
    } catch (error) {
      console.error('❌ 납세증명서 upsert 실패:', error);
      return false;
    }
  }

  async existsByUserAddressId(userAddressId: number): Promise<Pick<TaxCertCopyExistsResponseDto, 'exists' | 'updatedAt'>> {
    try {
      return await this.taxCertCopyRepository.existsByUserAddressId(userAddressId);
    } catch (error) {
      console.error('❌ 납세확인서 복사본 존재 여부 확인 오류:', error);
      return { exists: false };
    }
  }
} 