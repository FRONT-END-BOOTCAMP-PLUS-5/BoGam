import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';
import { CheckRealEstateCopyExistsResponseDto } from '@be/applications/realEstateCopies/dtos/CheckRealEstateCopyExistsResponseDto';

export interface RealEstateCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { realEstateData: string }
  ): Promise<RealEstateCopy>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<
    Pick<CheckRealEstateCopyExistsResponseDto, 'exists' | 'updatedAt'>
  >;
}
