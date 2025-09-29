import { TransactionSearchData } from '@be/domain/entities/TransactionSearch';

export interface GetTransactionSearchResponseDto {
  success: boolean;
  data?: TransactionSearchData;
  error?: string;
}
