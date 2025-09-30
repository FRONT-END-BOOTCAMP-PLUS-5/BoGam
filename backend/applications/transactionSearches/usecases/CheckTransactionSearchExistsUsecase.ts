import { TransactionSearchRepository } from '@be/domain/repository/TransactionSearchRepository';
import { CheckTransactionSearchExistsRequestDto } from '../dtos/CheckTransactionSearchExistsRequestDto';
import { CheckTransactionSearchExistsResponseDto } from '../dtos/CheckTransactionSearchExistsResponseDto';

export class CheckTransactionSearchExistsUsecase {
  constructor(private transactionSearchRepository: TransactionSearchRepository) {}

  async checkExists(request: CheckTransactionSearchExistsRequestDto): Promise<CheckTransactionSearchExistsResponseDto> {
    try {
      const exists = await this.transactionSearchRepository.exists(request.userAddressId);

      return {
        success: true,
        exists,
      };
    } catch (error) {
      console.error('CheckTransactionSearchExistsUsecase 오류:', error);
      return {
        success: false,
        exists: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
