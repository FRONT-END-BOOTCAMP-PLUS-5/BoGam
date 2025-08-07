import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

/**
 * 부동산등기부등본 DB CRUD UseCase
 * 클린 아키텍처의 Application 레이어
 * DB 조작 비즈니스 로직을 담당하며 Repository를 통해 데이터 접근
 */
export class RealEstateDbUseCase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async getRealEstateCopiesByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; }[]> {
    const realEstateCopies = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    
    // 복호화 처리
    return realEstateCopies.map(copy => ({
      id: copy.id,
      userAddressId: copy.userAddressId,
      realEstateJson: decryptJson(copy.realEstateData) as RealEstateCopyJson,
      updatedAt: copy.updatedAt
    }));
  }

  async upsertRealEstateCopy(data: { userAddressId: number; realEstateJson: RealEstateCopyJson }): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; }> {
    // JSON을 암호화된 문자열로 변환
    const encryptedData = encryptJson(data.realEstateJson);
    
    // Prisma upsert 사용
    const result = await this.realEstateCopyRepository.upsertByUserAddressId(data.userAddressId, {
      realEstateData: encryptedData
    });
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      id: result.id,
      userAddressId: result.userAddressId,
      realEstateJson: decryptJson(result.realEstateData) as RealEstateCopyJson,
      updatedAt: result.updatedAt
    };
  }
}