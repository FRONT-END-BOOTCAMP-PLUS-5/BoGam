import { BrokerCopyRepository } from '@be/domain/repository/BrokerCopyRepository';
import { BrokerCopyEntity } from '@be/domain/entities/BrokerCopy';
import { prisma } from '@utils/prisma';
import { getUserAddressId } from '@utils/userAddress';

export class BrokerCopyRepositoryImpl implements BrokerCopyRepository {
  async findByUserAddressId(
    userAddressId: number
  ): Promise<BrokerCopyEntity | null> {
    const broker = await prisma.broker.findFirst({
      where: { userAddressId },
    });

    if (!broker) return null;

    return new BrokerCopyEntity(
      broker.id,
      broker.userAddressId,
      broker.brokerData,
      broker.updatedAt
    );
  }

  async upsertByUserAddressId(
    userAddressId: number,
    data: { brokerData: string }
  ): Promise<BrokerCopyEntity> {
    const broker = await prisma.broker.upsert({
      where: { userAddressId },
      update: {
        brokerData: data.brokerData,
      },
      create: {
        userAddressId,
        brokerData: data.brokerData,
      },
    });

    return new BrokerCopyEntity(
      broker.id,
      broker.userAddressId,
      broker.brokerData,
      broker.updatedAt
    );
  }

  async existsByUserAddressId(
    userAddressId: number
  ): Promise<{ exists: boolean; updatedAt?: Date }> {
    try {
      const broker = await prisma.broker.findFirst({
        where: { userAddressId },
        select: { id: true, updatedAt: true },
      });

      return {
        exists: !!broker,
        updatedAt: broker?.updatedAt,
      };
    } catch (error) {
      console.error('❌ 중개사 복사본 존재 여부 확인 DB 오류:', error);
      return { exists: false };
    }
  }
}
