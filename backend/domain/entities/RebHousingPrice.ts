/**
 * 부동산 공시가격 알리미 공동주택 공시가격 Entity
 * Domain Layer에서 비즈니스 로직을 담당하는 핵심 객체
 */

export class RebHousingPriceDetail {
  constructor(
    public readonly resType: string, // 구분 (ex."주변환경|교육시설",..)
    public readonly resContents: string // 내용
  ) {}
}

export class RebHousingPriceTrHistory {
  constructor(
    public readonly resType: string, // 구분 (ex. "거래사례")
    public readonly resUserAddr: string, // 주소
    public readonly resFloor: string, // 층
    public readonly resArea: string, // 전용면적 (단위: m²)
    public readonly resDateOfContract: string, // 계약일 (YYYYMMDD)
    public readonly resAmount: string, // 금액 (단위: 천원)
    public readonly resAptName: string // 아파트명
  ) {}
}

export class RebHousingPriceItem {
  constructor(
    public readonly resReferenceDate: string, // 기준일자 (공시기준, YYYYMMDD)
    public readonly resComplexName: string, // 단지명
    public readonly resAddrDong: string, // 동
    public readonly resAddrHo: string, // 호
    public readonly resArea: string, // 면적 (전용면적, 단위: m²)
    public readonly resBasePrice: string, // 기준가격 (공동주택가격)
    public readonly resSourceType?: string, // 출처구분 (ex."부동산테크 (₩21.1.1)")
    public readonly resAmount1?: string, // 금액1 (상한가)
    public readonly resAmount2?: string, // 금액2 (하한가)
    public readonly resStandards?: string, // 산정기준 (산정의견)
    public readonly resDetailList?: RebHousingPriceDetail[], // 상세내역 List (주택특성자료)
    public readonly resTrHistoryList?: RebHousingPriceTrHistory[] // 거래내역 List (가격참고자료)
  ) {}
}

export class RebHousingPriceEntity {
  constructor(
    public readonly resUserAddr: string, // 주소 (열람지역)
    public readonly resPriceList: RebHousingPriceItem[] // 가격 List (공동주택공시가격)
  ) {}
}

// 2-way 인증 관련 타입들
export class RebTwoWayExtraInfo {
  constructor(
    public readonly reqSecureNo?: string, // 보안문자
    public readonly reqSecureNoRefresh?: string, // 보안문자 새로고침
    public readonly resResultList?: {
      resComplexName: string; // 단지명
      resAddrDong: string; // 동
      resAddrHo: string; // 호
    }[], // 주소 결과 리스트
    public readonly budongsan?: string // 부동산
  ) {}
}

export class RebTwoWayResponse {
  constructor(
    public readonly continue2Way: boolean, // 추가 인증 필요 유무
    public readonly method: string, // 추가 인증 방식
    public readonly jobIndex: number, // 잡 인덱스
    public readonly threadIndex: number, // 스레드 인덱스
    public readonly jti: string, // 트랜잭션 아이디
    public readonly twoWayTimestamp: number, // 추가 인증 시간
    public readonly extraInfo: RebTwoWayExtraInfo // 추가정보 Data
  ) {}
}
