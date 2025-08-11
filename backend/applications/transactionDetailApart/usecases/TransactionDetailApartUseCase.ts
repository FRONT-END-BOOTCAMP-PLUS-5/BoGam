import { CodefAuth, createCodefAuth } from '@libs/codefAuth';
import { TransactionDetailApartRepositoryImpl } from '../../../infrastructure/repository/TransactionDetailApartRepositoryImpl';
import { TransactionDetailApartRequest } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartRequest';
import { GetTransactionDetailApartResponse } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartResponse';

export class TransactionDetailApartUseCase {
  private readonly infrastructure: TransactionDetailApartRepositoryImpl;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.infrastructure = new TransactionDetailApartRepositoryImpl();
    this.codefAuth = createCodefAuth();
  }

  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  async getTransactionDetailApart(
    request: TransactionDetailApartRequest
  ): Promise<GetTransactionDetailApartResponse> {
    return this.infrastructure.getTransactionDetailApart(request);
  }

  hasData(response: GetTransactionDetailApartResponse): boolean {
    if (!response.data) return false;
    return Array.isArray(response.data)
      ? response.data.length > 0
      : !!(
          response.data.resSaleList?.length || response.data.resRentList?.length
        );
  }
}
