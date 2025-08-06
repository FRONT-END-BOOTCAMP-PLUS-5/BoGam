import { PrismaClient, Prisma } from '@prisma/generated';
import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy, CreateRealEstateCopyDto, UpdateRealEstateCopyDto, RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';

export class RealEstateCopyRepositoryImpl implements RealEstateCopyRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateRealEstateCopyDto): Promise<RealEstateCopy> {
    const realEstate = await this.prisma.realEstate.create({
      data: {
        userAddressId: data.userAddressId,
        realEstateJson: data.realEstateJson as Prisma.InputJsonValue,
      },
    });

    return {
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateJson: realEstate.realEstateJson as RealEstateCopyJson,
    };
  }

  async findByUserAddressId(userAddressId: number): Promise<RealEstateCopy[]> {
    const realEstates = await this.prisma.realEstate.findMany({
      where: { userAddressId },
    });

    return realEstates.map(realEstate => ({
      id: realEstate.id,
      userAddressId: realEstate.userAddressId,
      realEstateJson: realEstate.realEstateJson as RealEstateCopyJson,
    }));
  }

  async updateByUserAddressId(userAddressId: number, data: UpdateRealEstateCopyDto): Promise<RealEstateCopy> {
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
      throw new Error('RealEstateCopy not found for the given userAddressId');
    }

    return {
      id: updatedRealEstate.id,
      userAddressId: updatedRealEstate.userAddressId,
      realEstateJson: updatedRealEstate.realEstateJson as RealEstateCopyJson,
    };
  }

  async deleteByUserAddressId(userAddressId: number): Promise<void> {
    await this.prisma.realEstate.deleteMany({
      where: { userAddressId },
    });
  }
}