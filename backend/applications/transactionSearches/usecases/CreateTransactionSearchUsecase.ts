import { TransactionSearchRepository } from '@be/domain/repository/TransactionSearchRepository';
import { CreateTransactionSearchRequestDto } from '../dtos/CreateTransactionSearchRequestDto';
import { CreateTransactionSearchResponseDto } from '../dtos/CreateTransactionSearchResponseDto';

export class CreateTransactionSearchUsecase {
  constructor(private transactionSearchRepository: TransactionSearchRepository) {}

  async createTransactionSearch(request: CreateTransactionSearchRequestDto): Promise<CreateTransactionSearchResponseDto> {
    try {
      const transactionSearch = await this.transactionSearchRepository.upsert({
        userAddressId: request.userAddressId,
        transactionSearchData: JSON.stringify(request.transactionSearchData),
      });

      return {
        success: true,
        data: {
          id: transactionSearch.id,
        },
      };
    } catch (error) {
      console.error('CreateTransactionSearchUsecase 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
