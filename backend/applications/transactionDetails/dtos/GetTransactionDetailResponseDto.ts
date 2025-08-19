import { TransactionDetailApartEntity } from '@be/domain/entities/TransactionDetailApart';
import { TransactionDetailSingleEntity } from '@be/domain/entities/TransactionDetailSingle';

/**
 * 통합 실거래가 상세조회 응답 DTO
 */
export interface GetTransactionDetailResponseDto {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
    transactionId?: string;
  };
  data: {
    resSaleList?: TransactionDetailApartEntity[];
    resRentList?: TransactionDetailSingleEntity[];
  };
}
