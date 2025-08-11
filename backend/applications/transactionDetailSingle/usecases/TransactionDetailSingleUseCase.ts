import { CodefAuth, createCodefAuth } from '@libs/codefAuth';
import { TransactionDetailSingleRequest } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleRequest';
import { GetTransactionDetailSingleResponse } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleResponse';
import { TransactionDetailSingleRepositoryImpl } from '@be/infrastructure/repository/TransactionDetailSingleRepositoryImpl';

export class TransactionDetailSingleUseCase {
  private readonly infra: TransactionDetailSingleRepositoryImpl;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.infra = new TransactionDetailSingleRepositoryImpl();
    this.codefAuth = createCodefAuth();
  }

  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  async getTransactionDetailSingle(
    request: TransactionDetailSingleRequest
  ): Promise<GetTransactionDetailSingleResponse> {
    return this.infra.getTransactionDetailSingle(request);
  }
}
