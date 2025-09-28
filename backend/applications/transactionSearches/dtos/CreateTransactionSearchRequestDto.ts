import { TransactionSearchData } from '@be/domain/entities/TransactionSearch';

export interface CreateTransactionSearchRequestDto {
  userAddressId: number;
  transactionSearchData: TransactionSearchData;
}
