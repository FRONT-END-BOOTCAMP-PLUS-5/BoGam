import { TransactionDetailApartEntity } from '@be/domain/entities/TransactionDetailApart';
import { TransactionDetailApartRequest } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartRequest';

export interface TransactionDetailApartResult {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data?: TransactionDetailApartEntity | TransactionDetailApartEntity[];
}

/**
 * 실거래가 조회 리포지토리 인터페이스
 */
export interface TransactionDetailApartRepository {
  /**
   * 실거래가 조회 (아파트/연립다세대/오피스텔)
   */
  getTransactionDetailApartList(
    request: TransactionDetailApartRequest
  ): Promise<TransactionDetailApartResult>;
}
