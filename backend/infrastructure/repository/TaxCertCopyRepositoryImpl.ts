import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCertCopy } from '@be/domain/entities/TaxCertCopy';
import { prisma } from '@utils/prisma';

export class TaxCertCopyRepositoryImpl implements TaxCertCopyRepository {
  async findByUserAddressId(userAddressId: number): Promise<TaxCertCopy | null> {
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

  async upsertByUserAddressId(userAddressId: number, data: { taxCertData: string }): Promise<TaxCertCopy> {
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
} 