import { GetRealEstateTransactionItem } from './GetRealEstateTransactionResponse';

/**
 * 통합 실거래가 조회 응답 DTO
 * GET /api/transaction/all 전용
 */
export interface GetAllTransactionResponse {
  success: boolean;
  data: GetAllTransactionData;
  summary: GetAllTransactionSummary;
}

/**
 * 통합 실거래가 데이터
 */
export interface GetAllTransactionData {
  /** 모든 주택 유형의 거래 내역 */
  items: {
    item: GetRealEstateTransactionItem[];
  };
  
  /** 총 수집된 행 수 */
  numOfRows: string;
  
  /** 페이지 번호 (항상 "1") */
  pageNo: string;
  
  /** 총 거래 건수 */
  totalCount: string;
}

/**
 * 통합 실거래가 요약 정보
 */
export interface GetAllTransactionSummary {
  /** 조회 기간 정보 */
  dateRange: {
    /** 시작 계약년월 (YYYYMM) */
    startDate: string;
    
    /** 종료 계약년월 (YYYYMM) */
    endDate: string;
    
    /** 총 조회 개월 수 */
    totalMonths: number;
  };
  
  /** 전체 거래 건수 */
  totalCount: number;
  
  /** 아파트 거래 건수 */
  apartmentCount: number;
  
  /** 단독/다가구 거래 건수 */
  detachedHouseCount: number;
  
  /** 오피스텔 거래 건수 */
  officetelCount: number;
  
  /** 연립다세대 거래 건수 */
  rowHouseCount: number;
  
  /** 실제 수집된 총 건수 */
  collectedCount: number;
}

/**
 * 에러 응답 DTO
 */
export interface GetAllTransactionErrorResponse {
  success: false;
  message: string;
}
