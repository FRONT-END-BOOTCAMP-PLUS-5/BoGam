import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

/**
 * 등기부등본 DB CRUD UseCase
 * 클린 아키텍처의 Application 레이어
 * DB 조작 비즈니스 로직을 담당하며 Repository를 통해 데이터 접근
 */
export class RealEstateCopyUseCase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async getRealEstateCopyByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; } | null> {
    const realEstate = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    
    if (!realEstate) return null;
    
    // 복호화 처리
    return {
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateJson: decryptJson(realEstate.realEstateData) as RealEstateCopyJson,
      updatedAt: realEstate.updatedAt
    };
  }

  async upsertRealEstateCopy(data: { userAddressId: number; realEstateJson: RealEstateCopyJson }): Promise<boolean> {
    try {
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(data.realEstateJson);
      
      // Prisma upsert 사용
      await this.realEstateCopyRepository.upsertByUserAddressId(data.userAddressId, {
        realEstateData: encryptedData
      });
      
      return true;
    } catch (error) {
      console.error('❌ 등기부등본 upsert 실패:', error);
      return false;
    }
  }
} 