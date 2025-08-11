import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { RealEstateCopy } from '@be/domain/entities/RealEstateCopy';
import { prisma } from '@utils/prisma';
import { RealEstateCopyExistsResponseDto } from '@be/applications/realEstateCopies/dtos/RealEstateCopyDto';

export class RealEstateCopyRepositoryImpl implements RealEstateCopyRepository {
  async findByUserAddressId(
    userAddressId: number
  ): Promise<RealEstateCopy | null> {
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

  async upsertByUserAddressId(
    userAddressId: number,
    data: { realEstateData: string }
  ): Promise<RealEstateCopy> {
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

  async existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<RealEstateCopyExistsResponseDto, 'exists' | 'updatedAt'>> {
    try {
      const realEstate = await prisma.realEstate.findFirst({
        where: { userAddressId },
        select: { id: true, updatedAt: true },
      });

      return {
        exists: !!realEstate,
        updatedAt: realEstate?.updatedAt,
      };
    } catch (error) {
      console.error('❌ 등기부등본 복사본 존재 여부 확인 DB 오류:', error);
      return { exists: false };
    }
  }
}
