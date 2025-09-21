import { GuaranteeLimitCopyRepository } from '@be/domain/repository/GuaranteeLimitCopyRepository';
import { GuaranteeLimitCopyEntity } from '@be/domain/entities/GuaranteeLimitCopy';
import { prisma } from '@utils/prisma';
import { CheckGuaranteeLimitCopyExistsResponseDto } from '@be/applications/guaranteeLimitCopies/dtos/CheckGuaranteeLimitCopyExistsResponseDto';

export class GuaranteeLimitCopyRepositoryImpl implements GuaranteeLimitCopyRepository {
  async findByUserAddressId(
    userAddressId: number
  ): Promise<GuaranteeLimitCopyEntity | null> {
    const guaranteeLimit = await prisma.guaranteeLimit.findFirst({
      where: { userAddressId },
    });

    if (!guaranteeLimit) return null;

    return {
      id: guaranteeLimit.id,
      userAddressId: guaranteeLimit.userAddressId,
      guaranteeLimitData: guaranteeLimit.guaranteeLimitData,
      updatedAt: guaranteeLimit.updatedAt,
    };
  }

  async upsertByUserAddressId(
    userAddressId: number,
    data: { guaranteeLimitData: string }
  ): Promise<GuaranteeLimitCopyEntity> {
    const guaranteeLimit = await prisma.guaranteeLimit.upsert({
      where: { userAddressId },
      update: {
        guaranteeLimitData: data.guaranteeLimitData,
      },
      create: {
        userAddressId,
        guaranteeLimitData: data.guaranteeLimitData,
      },
    });

    return {
      id: guaranteeLimit.id,
      userAddressId: guaranteeLimit.userAddressId,
      guaranteeLimitData: guaranteeLimit.guaranteeLimitData,
      updatedAt: guaranteeLimit.updatedAt,
    };
  }

  async existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<CheckGuaranteeLimitCopyExistsResponseDto, 'exists' | 'updatedAt'>> {
    try {
      const guaranteeLimit = await prisma.guaranteeLimit.findFirst({
        where: { userAddressId },
        select: { id: true, updatedAt: true },
      });

      return {
        exists: !!guaranteeLimit,
        updatedAt: guaranteeLimit?.updatedAt,
      };
    } catch (error) {
      console.error('❌ 보증한도 복사본 존재 여부 확인 DB 오류:', error);
      return { exists: false, updatedAt: undefined };
    }
  }
}
