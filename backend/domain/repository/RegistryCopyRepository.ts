import { RegistryCopy, CreateRegistryCopyDto, UpdateRegistryCopyDto } from '../entities/RegistryCopy';

export interface RegistryCopyRepository {
  create(data: CreateRegistryCopyDto): Promise<RegistryCopy>;
  findByUserAddressId(userAddressId: number): Promise<RegistryCopy[]>;
  updateByUserAddressId(userAddressId: number, data: UpdateRegistryCopyDto): Promise<RegistryCopy>;
  deleteByUserAddressId(userAddressId: number): Promise<void>;
} 