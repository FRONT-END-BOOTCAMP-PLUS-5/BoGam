import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';

export interface RealEstateCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null>;
  upsertByUserAddressId(userAddressId: number, data: { realEstateData: string }): Promise<RealEstateCopy>;
}