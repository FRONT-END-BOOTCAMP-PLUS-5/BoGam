/**
 * 부동산 공시가격 알리미 공동주택 공시가격 Entity
 * Domain Layer에서 비즈니스 로직을 담당하는 핵심 객체
 */

export interface RebHousingPriceDetail {
  resType: string; // 구분 (ex."주변환경|교육시설",..)
  resContents: string; // 내용
}

export interface RebHousingPriceTrHistory {
  resType: string; // 구분 (ex. "거래사례")
  resUserAddr: string; // 주소
  resFloor: string; // 층
  resArea: string; // 전용면적 (단위: m²)
  resDateOfContract: string; // 계약일 (YYYYMMDD)
  resAmount: string; // 금액 (단위: 천원)
  resAptName: string; // 아파트명
}

export interface RebHousingPriceItem {
  resReferenceDate: string; // 기준일자 (공시기준, YYYYMMDD)
  resComplexName: string; // 단지명
  resAddrDong: string; // 동
  resAddrHo: string; // 호
  resArea: string; // 면적 (전용면적, 단위: m²)
  resBasePrice: string; // 기준가격 (공동주택가격)
  resSourceType?: string; // 출처구분 (ex."부동산테크 (₩21.1.1)")
  resAmount1?: string; // 금액1 (상한가)
  resAmount2?: string; // 금액2 (하한가)
  resStandards?: string; // 산정기준 (산정의견)
  resDetailList?: RebHousingPriceDetail[]; // 상세내역 List (주택특성자료)
  resTrHistoryList?: RebHousingPriceTrHistory[]; // 거래내역 List (가격참고자료)
}

export interface RebHousingPriceEntity {
  resUserAddr: string; // 주소 (열람지역)
  resPriceList: RebHousingPriceItem[]; // 가격 List (공동주택공시가격)
}

// 2-way 인증 관련 타입들
export interface RebTwoWayExtraInfo {
  reqSecureNo?: string; // 보안문자
  reqSecureNoRefresh?: string; // 보안문자 새로고침
  resResultList?: {
    resComplexName: string; // 단지명
    resAddrDong: string; // 동
    resAddrHo: string; // 호
  }[]; // 주소 결과 리스트
  budongsan?: string; // 부동산
}

export interface RebTwoWayResponse {
  continue2Way: boolean; // 추가 인증 필요 유무
  method: string; // 추가 인증 방식
  jobIndex: number; // 잡 인덱스
  threadIndex: number; // 스레드 인덱스
  jti: string; // 트랜잭션 아이디
  twoWayTimestamp: number; // 추가 인증 시간
  extraInfo: RebTwoWayExtraInfo; // 추가정보 Data
}
