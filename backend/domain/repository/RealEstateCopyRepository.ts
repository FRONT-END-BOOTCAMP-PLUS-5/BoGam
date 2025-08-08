import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';
import { RealEstateCopyExistsResponseDto } from '@be/applications/realEstateCopy/dtos/RealEstateCopyDto';

export interface RealEstateCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null>;
  upsertByUserAddressId(userAddressId: number, data: { realEstateData: string }): Promise<RealEstateCopy>;
  existsByUserAddressId(userAddressId: number): Promise<Pick<RealEstateCopyExistsResponseDto, 'exists' | 'updatedAt'>>;
}