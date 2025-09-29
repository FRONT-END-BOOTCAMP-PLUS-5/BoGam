import { TransactionSearch } from '../entities/TransactionSearch';

export interface TransactionSearchRepository {
  findByUserAddressId(userAddressId: number): Promise<TransactionSearch | null>;
  upsert(transactionSearch: Omit<TransactionSearch, 'id' | 'updatedAt'>): Promise<TransactionSearch>;
  exists(userAddressId: number): Promise<boolean>;
}
