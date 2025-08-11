import { TransactionDetailSingleEntity } from '@be/domain/entities/TransactionDetailSingle';
import { TransactionDetailSingleRequest } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleRequest';

export interface TransactionDetailSingleResult {
  result: { code: string; message: string; extraMessage?: string };
  data?: TransactionDetailSingleEntity | TransactionDetailSingleEntity[];
}

export interface TransactionDetailSingleRepository {
  getTransactionDetailSingleList(
    request: TransactionDetailSingleRequest
  ): Promise<TransactionDetailSingleResult>;
}
