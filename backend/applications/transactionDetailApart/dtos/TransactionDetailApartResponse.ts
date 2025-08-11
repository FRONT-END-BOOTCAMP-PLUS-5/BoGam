import { TransactionDetailApart } from '@be/domain/entities/TransactionDetailApart';

export interface BaseTransactionDetailApartResponse {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data?: TransactionDetailApart | TransactionDetailApart[];
}

export interface TransactionDetailApartResponse
  extends BaseTransactionDetailApartResponse {
  data: TransactionDetailApart | TransactionDetailApart[];
}

export type GetTransactionDetailApartResponse = TransactionDetailApartResponse;
