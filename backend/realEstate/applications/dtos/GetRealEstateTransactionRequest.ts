/**
 * 실거래가 조회 요청 DTO
 * 클린 아키텍처의 Application 레이어
 */
export interface GetRealEstateTransactionRequest {
  /** 지역코드 (법정동코드 5자리) */
  LAWD_CD: string;
  
  /** 계약년월 (YYYYMM 형식) */
  DEAL_YMD: string;
  
  /** 공공데이터포털 서비스키 */
  serviceKey: string;
  
  /** 한 페이지 결과 수 (기본값: 10) */
  numOfRows?: string;
  
  /** 페이지 번호 (기본값: 1) */
  pageNo?: string;
} 