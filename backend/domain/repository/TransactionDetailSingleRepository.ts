import { TransactionDetailSingle } from '@be/domain/entities/TransactionDetailSingle';
import { TransactionDetailSingleRequest } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleRequest';

export interface TransactionDetailSingleResult {
  result: { code: string; message: string; extraMessage?: string };
  data?: TransactionDetailSingle | TransactionDetailSingle[];
}

export interface TransactionDetailSingleRepository {
  getTransactionDetailSingle(
    request: TransactionDetailSingleRequest
  ): Promise<TransactionDetailSingleResult>;
}
