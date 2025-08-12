import { GetTransactionDetailRequestDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailRequestDto';
import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';

export interface TransactionDetailSingleRepository {
  getTransactionDetailSingleList(
    request: GetTransactionDetailRequestDto
  ): Promise<GetTransactionDetailResponseDto>;
}
