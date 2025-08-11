/**
 * 단독/다가구 실거래가 조회 요청 DTO
 */
export interface TransactionDetailSingleRequest {
  organization: string; // 0010
  addrSido: string;
  addrSigungu: string;
  addrDong: string;
  contractYear: string; // YYYY
  contractType: string; // 0/1/2
}
