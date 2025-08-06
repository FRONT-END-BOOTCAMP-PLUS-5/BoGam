import { RealEstateCopy, CreateRealEstateCopyDto, UpdateRealEstateCopyDto } from '../entities/RealEstateCopy';

export interface RealEstateCopyRepository {
  create(data: CreateRealEstateCopyDto): Promise<RealEstateCopy>;
  findByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]>;
  updateByUserAddressId(userAddressId: number, data: UpdateRealEstateCopyDto): Promise<RealEstateCopy>;
  deleteByUserAddressId(userAddressId: number): Promise<void>;
}