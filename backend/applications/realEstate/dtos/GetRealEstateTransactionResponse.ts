/**
 * 실거래가 조회 응답 DTO
 * 클린 아키텍처의 Application 레이어
 */
export interface GetRealEstateTransactionResponse {
  /** 응답 헤더 */
  header: {
    /** 결과 코드 */
    resultCode: string;
    /** 결과 메시지 */
    resultMsg: string;
  };
  
  /** 응답 바디 */
  body: {
    /** 아이템 목록 */
    items: {
      /** 실거래가 아이템 배열 */
      item: GetRealEstateTransactionItem[];
    };
    /** 한 페이지 결과 수 */
    numOfRows: string;
    /** 페이지 번호 */
    pageNo: string;
    /** 전체 결과 수 */
    totalCount: string;
  };
}

/**
 * 실거래가 아이템 DTO
 */
export interface GetRealEstateTransactionItem {
  /** 아파트명 */
  aptNm: string;
  /** 건축년도 */
  buildYear: string;
  /** 계약기간 */
  contractTerm: string;
  /** 계약구분 */
  contractType: string;
  /** 계약일 */
  dealDay: string;
  /** 계약월 */
  dealMonth: string;
  /** 계약년 */
  dealYear: string;
  /** 보증금 */
  deposit: string;
  /** 전용면적 */
  excluUseAr: string;
  /** 층 */
  floor: string;
  /** 지번 */
  jibun: string;
  /** 월세 */
  monthlyRent: string;
  /** 이전 보증금 */
  preDeposit: string;
  /** 이전 월세 */
  preMonthlyRent: string;
  /** 시군구코드 */
  sggCd: string;
  /** 읍면동명 */
  umdNm: string;
  /** 사용승인일 */
  useRRRight: string;
} 