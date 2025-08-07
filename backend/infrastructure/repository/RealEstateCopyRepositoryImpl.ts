import { PrismaClient, Prisma } from '@prisma/generated';
import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';

export class RealEstateCopyRepositoryImpl implements RealEstateCopyRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]> {
    const realEstates = await this.prisma.realEstate.findMany({
      where: { userAddressId },
    });

    return realEstates.map(realEstate => ({
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateData: realEstate.realEstateData,
      updatedAt: realEstate.updatedAt,
    }));
  }

  async upsertByUserAddressId(userAddressId: number, data: { realEstateData: string }): Promise<RealEstateCopy> {
    const realEstate = await this.prisma.realEstate.upsert({
      where: { userAddressId },
      update: {
        realEstateData: data.realEstateData,
      },
      create: {
        userAddressId,
        realEstateData: data.realEstateData,
      },
    });

    return {
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateData: realEstate.realEstateData,
      updatedAt: realEstate.updatedAt,
    };
  }
}