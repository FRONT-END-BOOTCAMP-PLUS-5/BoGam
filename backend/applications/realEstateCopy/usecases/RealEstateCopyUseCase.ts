import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy, CreateRealEstateCopyDto, UpdateRealEstateCopyDto, RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

export class RealEstateCopyUseCase {
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

  async updateRealEstateCopy(userAddressId: number, data: { realEstateJson: RealEstateCopyJson }): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; }> {
    // JSON을 암호화된 문자열로 변환
    const encryptedData: UpdateRealEstateCopyDto = {
      realEstateData: encryptJson(data.realEstateJson)
    };
    
    const result = await this.realEstateCopyRepository.updateByUserAddressId(userAddressId, encryptedData);
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      id: result.id,
      userAddressId: result.userAddressId,
      realEstateJson: decryptJson(result.realEstateData) as RealEstateCopyJson,
      updatedAt: result.updatedAt
    };
  }

  async deleteRealEstateCopy(userAddressId: number): Promise<void> {
    await this.realEstateCopyRepository.deleteByUserAddressId(userAddressId);
  }

  async findRealEstateCopyByUserAddressId(userAddressId: number): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; } | null> {
    const realEstateCopies = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    if (realEstateCopies.length === 0) return null;
    
    const copy = realEstateCopies[0];
    return {
      id: copy.id,
      userAddressId: copy.userAddressId,
      realEstateJson: decryptJson(copy.realEstateData) as RealEstateCopyJson,
      updatedAt: copy.updatedAt
    };
  }

  async upsertRealEstateCopy(data: { userAddressId: number; realEstateJson: RealEstateCopyJson }): Promise<{ id: number; userAddressId: number; realEstateJson: RealEstateCopyJson; updatedAt?: Date; }> {
    // JSON을 암호화된 문자열로 변환
    const encryptedData: CreateRealEstateCopyDto = {
      userAddressId: data.userAddressId,
      realEstateData: encryptJson(data.realEstateJson)
    };
    
    const existingEncrypted = await this.realEstateCopyRepository.findByUserAddressId(data.userAddressId);
    const existing = existingEncrypted.length > 0 ? existingEncrypted[0] : null;
    
    let result: RealEstateCopy;
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      result = await this.realEstateCopyRepository.updateByUserAddressId(data.userAddressId, {
        realEstateData: encryptedData.realEstateData
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      result = await this.realEstateCopyRepository.create(encryptedData);
    }
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      id: result.id,
      userAddressId: result.userAddressId,
      realEstateJson: decryptJson(result.realEstateData) as RealEstateCopyJson,
      updatedAt: result.updatedAt
    };
  }
}