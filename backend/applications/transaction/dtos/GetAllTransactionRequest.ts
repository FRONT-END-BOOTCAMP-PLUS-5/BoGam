/**
 * 통합 실거래가 조회 요청 DTO
 * GET /api/transaction/all 전용
 */
export interface GetAllTransactionRequest {
  /** 지역코드 (법정동코드 5자리) */
  LAWD_CD: string;
  
  /** 계약년월 (YYYYMM 형식) - 시작 날짜 */
  DEAL_YMD: string;
  
  /** 페이지당 행 수 (배치 사이즈) */
  numOfRows?: string;
}

/**
 * 통합 실거래가 조회 옵션
 */
export interface GetAllTransactionOptions {
  /** 최대 수집할 아이템 수 */
  maxItems?: number;
  
  /** 한 번에 가져올 아이템 수 (기본값: 1000) */
  batchSize?: number;
  
  /** 서비스 키 (선택적) */
  serviceKey?: string;
}
