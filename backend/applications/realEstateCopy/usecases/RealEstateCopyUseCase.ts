import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy, CreateRealEstateCopyDto, UpdateRealEstateCopyDto } from '@be/domain/entities/RealEstateCopy';

export class RealEstateCopyUseCase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async getRealEstateCopiesByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]> {
    return await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
  }

  async updateRealEstateCopy(userAddressId: number, data: UpdateRealEstateCopyDto): Promise<RealEstateCopy> {
    return await this.realEstateCopyRepository.updateByUserAddressId(userAddressId, data);
  }

  async deleteRealEstateCopy(userAddressId: number): Promise<void> {
    await this.realEstateCopyRepository.deleteByUserAddressId(userAddressId);
  }

  async findRealEstateCopyByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null> {
    const realEstateCopies = await this.realEstateCopyRepository.findByUserAddressId(userAddressId);
    return realEstateCopies.length > 0 ? realEstateCopies[0] : null;
  }

  async upsertRealEstateCopy(data: CreateRealEstateCopyDto): Promise<RealEstateCopy> {
    const existing = await this.findRealEstateCopyByUserAddressId(data.userAddressId);
    
    if (existing) {
      // 기존 데이터가 있으면 업데이트
      return await this.realEstateCopyRepository.updateByUserAddressId(data.userAddressId, {
        realEstateJson: data.realEstateJson
      });
    } else {
      // 기존 데이터가 없으면 새로 생성
      return await this.realEstateCopyRepository.create(data);
    }
  }
}