import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { TransactionDetailApartRepository } from '@be/domain/repository/TransactionDetailApartRepository';
import { TransactionDetailApartRequest } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartRequest';
import { GetTransactionDetailApartResponse } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartResponse';
import { processResponse } from '@libs/responseUtils';
import { sanitizeTransactionDetailApartResponse } from '@be/infrastructure/mappers/TransactionDetailApartMapper';

export class TransactionDetailApartRepositoryImpl
  implements TransactionDetailApartRepository
{
  private codefAuth: CodefAuth;
  private readonly timeout = 100000; // 100초

  constructor() {
    this.codefAuth = createCodefAuth();
  }

  async getTransactionDetailApartList(
    request: TransactionDetailApartRequest
  ): Promise<GetTransactionDetailApartResponse> {
    try {
      const accessToken = await this.codefAuth.getAccessToken();
      const response = await axios.post(
        CODEF_API_CONFIG.ACTUAL_TRANSACTION_APARTMENT_FULL_URL,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CodefSandbox/1.0',
          },
          timeout: this.timeout,
        }
      );

      const data: GetTransactionDetailApartResponse =
        processResponse<GetTransactionDetailApartResponse>(response.data);

      // 필요한 필드만 남기기
      const sanitized = sanitizeTransactionDetailApartResponse(data);

      return sanitized;
    } catch (error) {
      console.error('❌ 실거래가 조회 실패:', error);
      throw error;
    }
  }
}
