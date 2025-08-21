import { BrokerCopyEntity } from '@be/domain/entities/BrokerCopy';

export interface BrokerCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<BrokerCopyEntity | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { brokerData: string }
  ): Promise<BrokerCopyEntity>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<{ exists: boolean; updatedAt?: Date }>;
}
