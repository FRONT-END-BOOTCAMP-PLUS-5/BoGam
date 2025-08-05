/**
 * 연립다세대 매매 실거래가 조회 응답 DTO
 * 클린 아키텍처의 Application 레이어
 */
export interface GetRowHouseTransactionResponse {
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
      item: GetRowHouseTransactionItem[];
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
 * 연립다세대 매매 실거래가 아이템 DTO
 */
export interface GetRowHouseTransactionItem {
  /** 건축년도 */
  buildYear: string;
  /** 매수자 구분 */
  buyerGbn: string;
  /** 계약일 */
  cdealDay: string;
  /** 계약구분 */
  cdealType: string;
  /** 거래금액 */
  dealAmount: string;
  /** 거래일 */
  dealDay: string;
  /** 거래월 */
  dealMonth: string;
  /** 거래년 */
  dealYear: string;
  /** 거래구분 */
  dealingGbn: string;
  /** 중개사소재지 */
  estateAgentSggNm: string;
  /** 전용면적 */
  excluUseAr: string;
  /** 층 */
  floor: string;
  /** 주택유형 */
  houseType: string;
  /** 지번 */
  jibun: string;
  /** 대지면적 */
  landAr: string;
  /** 주택명 */
  mhouseNm: string;
  /** 등기일자 */
  rgstDate: string;
  /** 시군구코드 */
  sggCd: string;
  /** 매도자 구분 */
  slerGbn: string;
  /** 읍면동명 */
  umdNm: string;
} 