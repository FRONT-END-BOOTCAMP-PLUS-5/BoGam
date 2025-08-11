import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import {
  loadCodefConfig,
  validateCodefConfig,
} from '@libs/codef/codefEnvironment';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { TransactionDetailSingleRepository } from '@be/domain/repository/TransactionDetailSingleRepository';
import { TransactionDetailSingleRequest } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleRequest';
import { GetTransactionDetailSingleResponse } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleResponse';
import { processResponse } from '@libs/responseUtils';
import { sanitizeTransactionDetailSingleResponse } from '@be/infrastructure/mappers/TransactionDetailSingleMapper';

export class TransactionDetailSingleRepositoryImpl
  implements TransactionDetailSingleRepository
{
  private codefAuth: CodefAuth;
  private readonly timeout = 100000;

  constructor() {
    const config = loadCodefConfig();
    const validation = validateCodefConfig(config);
    if (!validation.isValid) {
      console.warn('⚠️ CODEF 설정 검증 실패:', validation.errors);
    }
    this.codefAuth = createCodefAuth();
  }

  async getTransactionDetailSingleList(
    request: TransactionDetailSingleRequest
  ): Promise<GetTransactionDetailSingleResponse> {
    const accessToken = await this.codefAuth.getAccessToken();
    const res = await axios.post(
      CODEF_API_CONFIG.ACTUAL_TRANSACTION_HOUSE_FULL_URL,
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
    const data = processResponse<GetTransactionDetailSingleResponse>(res.data);
    return sanitizeTransactionDetailSingleResponse(data);
  }
}
