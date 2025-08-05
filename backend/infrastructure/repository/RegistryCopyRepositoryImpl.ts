import { PrismaClient, Prisma } from '@prisma/generated';
import { RegistryCopyRepository } from '@be/domain/repository/RegistryCopyRepository';
import { RegistryCopy, CreateRegistryCopyDto, UpdateRegistryCopyDto, RegistryCopyJson } from '@be/domain/entities/RegistryCopy';

export class RegistryCopyRepositoryImpl implements RegistryCopyRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateRegistryCopyDto): Promise<RegistryCopy> {
    const realEstate = await this.prisma.realEstate.create({
      data: {
        userAddressId: data.userAddressId,
        realEstateJson: data.realEstateJson as Prisma.InputJsonValue,
      },
    });

    return {
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateJson: realEstate.realEstateJson as RegistryCopyJson,
    };
  }

  async findByUserAddressId(userAddressId: number): Promise<RegistryCopy[]> {
    const realEstates = await this.prisma.realEstate.findMany({
      where: { userAddressId },
    });

    return realEstates.map(realEstate => ({
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateJson: realEstate.realEstateJson as RegistryCopyJson,
    }));
  }

  async updateByUserAddressId(userAddressId: number, data: UpdateRegistryCopyDto): Promise<RegistryCopy> {
    const realEstate = await this.prisma.realEstate.updateMany({
      where: { userAddressId },
      data: {
        realEstateJson: data.realEstateJson as Prisma.InputJsonValue,
      },
    });

    // 업데이트된 레코드를 다시 조회
    const updatedRealEstate = await this.prisma.realEstate.findFirst({
      where: { userAddressId },
    });

    if (!updatedRealEstate) {
      throw new Error('RegistryCopy not found for the given userAddressId');
    }

    return {
      id: updatedRealEstate.id,
      userAddressId: updatedRealEstate.userAddressId,
      realEstateJson: updatedRealEstate.realEstateJson as RegistryCopyJson,
    };
  }

  async deleteByUserAddressId(userAddressId: number): Promise<void> {
    await this.prisma.realEstate.deleteMany({
      where: { userAddressId },
    });
  }
} 