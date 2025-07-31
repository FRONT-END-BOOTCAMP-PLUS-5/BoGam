/**
 * 실거래가 조회 API 요청 DTO
 */

// 실거래가 조회 요청 기본 필드
export interface BaseRealEstateTransactionRequest {
  LAWD_CD: string; // 지역코드 (법정동코드 5자리)
  DEAL_YMD: string; // 계약년월 (YYYYMM 형식)
  serviceKey: string; // 공공데이터포털 서비스키
  numOfRows?: string; // 한 페이지 결과 수 (기본값: 10)
  pageNo?: string; // 페이지 번호 (기본값: 1)
}

// 아파트 전월세 실거래가 조회 요청
export interface GetApartmentRentTransactionRequest extends BaseRealEstateTransactionRequest {
  // 추가 필드가 필요한 경우 여기에 정의
}

// 단독/다가구 전월세 실거래가 조회 요청
export interface GetDetachedHouseRentTransactionRequest extends BaseRealEstateTransactionRequest {
  // 추가 필드가 필요한 경우 여기에 정의
}

// 오피스텔 전월세 실거래가 조회 요청
export interface GetOfficetelRentTransactionRequest extends BaseRealEstateTransactionRequest {
  // 추가 필드가 필요한 경우 여기에 정의
}

// 통합 요청 타입 (union type)
export type GetRealEstateTransactionRequest =
  | GetApartmentRentTransactionRequest
  | GetDetachedHouseRentTransactionRequest
  | GetOfficetelRentTransactionRequest; 