import { PrismaClient, Prisma } from '@prisma/generated';
import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { TaxCert, CreateTaxCertDto, UpdateTaxCertDto, TaxCertJson } from '@be/domain/entities/TaxCert';

export class TaxCertCopyRepositoryImpl implements TaxCertCopyRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateTaxCertDto): Promise<TaxCert> {
    const taxCert = await this.prisma.taxCert.create({
      data: {
        userAddressId: data.userAddressId,
        taxCertJson: data.taxCertJson as Prisma.InputJsonValue,
      },
    });

    return {
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertJson: taxCert.taxCertJson as TaxCertJson,
    };
  }

  async findByUserAddressId(userAddressId: number): Promise<TaxCert[]> {
    const taxCerts = await this.prisma.taxCert.findMany({
      where: { userAddressId },
    });

    return taxCerts.map(taxCert => ({
      id: taxCert.id,
      userAddressId: taxCert.userAddressId,
      taxCertJson: taxCert.taxCertJson as TaxCertJson,
    }));
  }

  async updateByUserAddressId(userAddressId: number, data: UpdateTaxCertDto): Promise<TaxCert> {
    const taxCert = await this.prisma.taxCert.updateMany({
      where: { userAddressId },
      data: {
        taxCertJson: data.taxCertJson as Prisma.InputJsonValue,
      },
    });

    // 업데이트된 레코드를 다시 조회
    const updatedTaxCert = await this.prisma.taxCert.findFirst({
      where: { userAddressId },
    });

    if (!updatedTaxCert) {
      throw new Error('TaxCert not found for the given userAddressId');
    }

    return {
      id: updatedTaxCert.id,
      userAddressId: updatedTaxCert.userAddressId,
      taxCertJson: updatedTaxCert.taxCertJson as TaxCertJson,
    };
  }

  async deleteByUserAddressId(userAddressId: number): Promise<void> {
    await this.prisma.taxCert.deleteMany({
      where: { userAddressId },
    });
  }
} 