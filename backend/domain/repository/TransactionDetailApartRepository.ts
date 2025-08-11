import { GetTransactionDetailRequestDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailRequestDto';
import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';

/**
 * 실거래가 조회 리포지토리 인터페이스
 */
export interface TransactionDetailApartRepository {
  /**
   * 실거래가 조회 (아파트/연립다세대/오피스텔)
   */
  getTransactionDetailApartList(
    request: GetTransactionDetailRequestDto
  ): Promise<GetTransactionDetailResponseDto>;
}
