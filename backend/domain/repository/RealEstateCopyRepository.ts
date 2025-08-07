import { RealEstateCopy } from '../entities/RealEstateCopy';

export interface RealEstateCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]>;
  upsertByUserAddressId(userAddressId: number, data: { realEstateData: string }): Promise<RealEstateCopy>;
}