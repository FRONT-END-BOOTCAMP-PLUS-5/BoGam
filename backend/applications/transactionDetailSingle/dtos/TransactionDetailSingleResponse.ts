import { TransactionDetailSingle } from '@be/domain/entities/TransactionDetailSingle';

export interface BaseTransactionDetailSingleResponse {
  result: { code: string; message: string; extraMessage?: string };
  data?: TransactionDetailSingle | TransactionDetailSingle[];
}

export interface TransactionDetailSingleResponse
  extends BaseTransactionDetailSingleResponse {
  data: TransactionDetailSingle | TransactionDetailSingle[];
}

export type GetTransactionDetailSingleResponse =
  TransactionDetailSingleResponse;
