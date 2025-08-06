import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy, CreateRealEstateCopyDto, UpdateRealEstateCopyDto } from '@be/domain/entities/RealEstateCopy';
import { encryptJson, decryptJson } from '../../../../utils/encryption';

export class RealEstateCopyUseCase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async getRealEstateCopiesByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]> {
    const realEstateCopies = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    
    // 복호화 처리
    return realEstateCopies.map(copy => ({
      ...copy,
      realEstateJson: this.decryptRealEstateJson(copy.realEstateJson)
    }));
  }

  async updateRealEstateCopy(userAddressId: number, data: UpdateRealEstateCopyDto): Promise<RealEstateCopy> {
    // 업데이트할 데이터가 있으면 암호화
    const encryptedData = data.realEstateJson ? {
      ...data,
      realEstateJson: this.encryptRealEstateJson(data.realEstateJson)
    } : data;
    
    const result = await this.realEstateCopyRepository.updateByUserAddressId(userAddressId, encryptedData);
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      ...result,
      realEstateJson: this.decryptRealEstateJson(result.realEstateJson)
    };
  }

  async deleteRealEstateCopy(userAddressId: number): Promise<void> {
    await this.realEstateCopyRepository.deleteByUserAddressId(userAddressId);
  }

  async findRealEstateCopyByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null> {
    const realEstateCopies = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    if (realEstateCopies.length === 0) return null;
    
    const copy = realEstateCopies[0];
    return {
      ...copy,
      realEstateJson: this.decryptRealEstateJson(copy.realEstateJson)
    };
  }

  async upsertRealEstateCopy(data: CreateRealEstateCopyDto): Promise<RealEstateCopy> {
    // 암호화된 데이터로 변환
    const encryptedData = {
      ...data,
      realEstateJson: this.encryptRealEstateJson(data.realEstateJson)
    };
    
    const existingEncrypted = await this.realEstateCopyRepository.findByUserAddressId(data.userAddressId);
    const existing = existingEncrypted.length > 0 ? existingEncrypted[0] : null;
    
    let result: RealEstateCopy;
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      result = await this.realEstateCopyRepository.updateByUserAddressId(data.userAddressId, {
        realEstateJson: encryptedData.realEstateJson
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      result = await this.realEstateCopyRepository.create(encryptedData);
    }
    
    // 응답 시에는 복호화된 데이터 반환
    return {
      ...result,
      realEstateJson: this.decryptRealEstateJson(result.realEstateJson)
    };
  }

  // 암호화 헬퍼 메서드
  private encryptRealEstateJson(realEstateJson: Record<string, unknown>): Record<string, unknown> {
    try {
      const encryptedString = encryptJson(realEstateJson);
      return { encrypted: encryptedString };
    } catch (error) {
      console.error('등기부등본 JSON 암호화 실패:', error);
      throw new Error('등기부등본 데이터 암호화에 실패했습니다.');
    }
  }

  // 복호화 헬퍼 메서드
  private decryptRealEstateJson(realEstateJson: Record<string, unknown>): Record<string, unknown> {
    try {
      // 암호화된 데이터인지 확인
      if (typeof realEstateJson === 'object' && realEstateJson !== null && 'encrypted' in realEstateJson) {
        return decryptJson(realEstateJson.encrypted as string);
      }
      // 암호화되지 않은 기존 데이터는 그대로 반환 (하위 호환성)
      return realEstateJson;
    } catch (error) {
      console.error('등기부등본 JSON 복호화 실패:', error);
      throw new Error('등기부등본 데이터 복호화에 실패했습니다.');
    }
  }
}