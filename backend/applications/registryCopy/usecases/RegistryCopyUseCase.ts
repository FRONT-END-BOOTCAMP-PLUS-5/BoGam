import { RegistryCopyRepository } from '@be/domain/repository/RegistryCopyRepository';
import { RegistryCopy, CreateRegistryCopyDto, UpdateRegistryCopyDto } from '@be/domain/entities/RegistryCopy';

export class RegistryCopyUseCase {
  constructor(private registryCopyRepository: RegistryCopyRepository) {}

  async createRegistryCopy(data: CreateRegistryCopyDto): Promise<RegistryCopy> {
    return await this.registryCopyRepository.create(data);
  }

  async getRegistryCopiesByUserAddressId(userAddressId: number): Promise<RegistryCopy[]> {
    return await this.registryCopyRepository.findByUserAddressId(userAddressId);
  }

  async updateRegistryCopy(userAddressId: number, data: UpdateRegistryCopyDto): Promise<RegistryCopy> {
    return await this.registryCopyRepository.updateByUserAddressId(userAddressId, data);
  }

  async deleteRegistryCopy(userAddressId: number): Promise<void> {
    await this.registryCopyRepository.deleteByUserAddressId(userAddressId);
  }
} 