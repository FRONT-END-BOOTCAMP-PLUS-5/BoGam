import { RealEstateCopyEntity } from '@be/domain/entities/RealEstateCopy';
import { CheckRealEstateCopyExistsResponseDto } from '@be/applications/realEstateCopies/dtos/CheckRealEstateCopyExistsResponseDto';

export interface RealEstateCopyRepository {
  findByUserAddressId(
    userAddressId: number
  ): Promise<RealEstateCopyEntity | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { realEstateData: string }
  ): Promise<RealEstateCopyEntity>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<
    Pick<CheckRealEstateCopyExistsResponseDto, 'exists' | 'updatedAt'>
  >;
}
