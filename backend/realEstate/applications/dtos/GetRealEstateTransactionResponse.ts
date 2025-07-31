/**
 * 실거래가 조회 API 응답 DTO
 */

// 공통 응답 헤더
export interface RealEstateTransactionResponseHeader {
  resultCode: string; // 결과 코드
  resultMsg: string; // 결과 메시지
}

// 실거래가 항목
export interface RealEstateTransactionItem {
  aptNm: string; // 아파트명
  buildYear: string; // 건축년도
  contractTerm: string; // 계약기간
  contractType: string; // 계약구분
  dealDay: string; // 계약일
  dealMonth: string; // 계약월
  dealYear: string; // 계약년
  deposit: string; // 보증금
  excluUseAr: string; // 전용면적
  floor: string; // 층
  jibun: string; // 지번
  monthlyRent: string; // 월세
  preDeposit: string; // 선보증금
  preMonthlyRent: string; // 선월세
  sggCd: string; // 시군구코드
  umdNm: string; // 읍면동명
  useRRRight: string; // 사용권리
}

// 실거래가 응답 바디
export interface RealEstateTransactionResponseBody {
  items: {
    item: RealEstateTransactionItem[]; // 실거래가 목록
  };
  numOfRows: string; // 한 페이지 결과 수
  pageNo: string; // 페이지 번호
  totalCount: string; // 전체 결과 수
}

// 실거래가 통합 응답
export interface RealEstateTransactionResponse {
  header: RealEstateTransactionResponseHeader;
  body: RealEstateTransactionResponseBody;
}

// 에러 응답
export interface RealEstateTransactionErrorResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body?: {
    items: {
      item: any[];
    };
  };
}

// 통합 응답 타입 (union type)
export type GetRealEstateTransactionResponse = 
  | RealEstateTransactionResponse 
  | RealEstateTransactionErrorResponse; 