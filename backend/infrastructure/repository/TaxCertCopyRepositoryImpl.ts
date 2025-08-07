import { PrismaClient, Prisma } from '@prisma/generated';
import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert } from '@be/domain/entities/TaxCert';

export class TaxCertCopyRepositoryImpl implements TaxCertCopyRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserAddressId(userAddressId: number): Promise<TaxCert[]> {
    const taxCerts = await this.prisma.taxCert.findMany({
      where: { userAddressId },
    });

    return taxCerts.map(taxCert => ({
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertData: taxCert.taxCertData,
      updatedAt: taxCert.updatedAt,
    }));
  }

  async upsertByUserAddressId(userAddressId: number, data: { taxCertData: string }): Promise<TaxCert> {
    const taxCert = await this.prisma.taxCert.upsert({
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