import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCertCopyEntity } from '@be/domain/entities/TaxCertCopy';
import { prisma } from '@utils/prisma';
import { CheckTaxCertCopyExistsResponseDto } from '@be/applications/taxCertCopies/dtos/CheckTaxCertCopyExistsResponseDto';

export class TaxCertCopyRepositoryImpl implements TaxCertCopyRepository {
  async findByUserAddressId(
    userAddressId: number
  ): Promise<TaxCertCopyEntity | null> {
    const taxCert = await prisma.taxCert.findFirst({
      where: { userAddressId },
    });

    if (!taxCert) return null;

    return {
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertData: taxCert.taxCertData,
      updatedAt: taxCert.updatedAt,
    };
  }

  async upsertByUserAddressId(
    userAddressId: number,
    data: { taxCertData: string }
  ): Promise<TaxCertCopyEntity> {
    const taxCert = await prisma.taxCert.upsert({
      where: { userAddressId },
      update: {
        taxCertData: data.taxCertData,
      },
      create: {
        userAddressId,
        taxCertData: data.taxCertData,
      },
    });

    return {
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertData: taxCert.taxCertData,
      updatedAt: taxCert.updatedAt,
    };
  }

  async existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<CheckTaxCertCopyExistsResponseDto, 'exists' | 'updatedAt'>> {
    try {
      const taxCert = await prisma.taxCert.findFirst({
        where: { userAddressId },
        select: { id: true, updatedAt: true },
      });

      return {
        exists: !!taxCert,
        updatedAt: taxCert?.updatedAt,
      };
    } catch (error) {
      console.error('❌ 납세확인서 복사본 존재 여부 확인 DB 오류:', error);
      return { exists: false };
    }
  }
}
