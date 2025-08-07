import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';
import { prisma } from '@utils/prisma';

export class RealEstateCopyRepositoryImpl implements RealEstateCopyRepository {
  async findByUserAddressId(userAddressId: number): Promise<RealEstateCopy | null> {
    const realEstate = await prisma.realEstate.findFirst({
      where: { userAddressId },
    });

    if (!realEstate) return null;

    return {
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateData: realEstate.realEstateData,
      updatedAt: realEstate.updatedAt,
    };
  }

  async upsertByUserAddressId(userAddressId: number, data: { realEstateData: string }): Promise<RealEstateCopy> {
    const realEstate = await prisma.realEstate.upsert({
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