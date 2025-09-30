import { TransactionSearchRepository } from '@be/domain/repository/TransactionSearchRepository';
import { GetTransactionSearchRequestDto } from '../dtos/GetTransactionSearchRequestDto';
import { GetTransactionSearchResponseDto } from '../dtos/GetTransactionSearchResponseDto';
import { TransactionSearchData } from '@be/domain/entities/TransactionSearch';
import { decrypt } from '@utils/encryption';

export class GetTransactionSearchUsecase {
  constructor(private transactionSearchRepository: TransactionSearchRepository) {}

  async getTransactionSearch(request: GetTransactionSearchRequestDto): Promise<GetTransactionSearchResponseDto> {
    try {
      const transactionSearch = await this.transactionSearchRepository.findByUserAddressId(request.userAddressId);

      if (!transactionSearch) {
        return {
          success: false,
          error: 'TransactionSearch 데이터를 찾을 수 없습니다.',
        };
      }

      // 암호화된 데이터를 복호화
      const decryptedData = decrypt(transactionSearch.transactionSearchData);
      const transactionSearchData: TransactionSearchData = JSON.parse(decryptedData);

      return {
        success: true,
        data: transactionSearchData,
      };
    } catch (error) {
      console.error('GetTransactionSearchUsecase 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
