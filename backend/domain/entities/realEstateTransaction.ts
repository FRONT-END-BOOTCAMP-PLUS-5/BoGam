/**
 * 실거래가 조회 API 응답 데이터 Entity
 */

// 실거래가 항목
export class RealEstateTransactionItem {
  constructor(
    public aptNm: string, // 아파트명
    public buildYear: string, // 건축년도
    public contractTerm: string, // 계약기간
    public contractType: string, // 계약구분
    public dealDay: string, // 계약일
    public dealMonth: string, // 계약월
    public dealYear: string, // 계약년
    public deposit: string, // 보증금
    public excluUseAr: string, // 전용면적
    public floor: string, // 층
    public jibun: string, // 지번
    public monthlyRent: string, // 월세
    public preDeposit: string, // 선보증금
    public preMonthlyRent: string, // 선월세
    public sggCd: string, // 시군구코드
    public umdNm: string, // 읍면동명
    public useRRRight: string // 사용권리
  ) {}
}

// 실거래가 응답 헤더
export class RealEstateTransactionResponseHeader {
  constructor(
    public resultCode: string, // 결과 코드
    public resultMsg: string // 결과 메시지
  ) {}
}

// 실거래가 응답 바디
export class RealEstateTransactionResponseBody {
  constructor(
    public items: RealEstateTransactionItem[], // 실거래가 목록
    public numOfRows: string, // 한 페이지 결과 수
    public pageNo: string, // 페이지 번호
    public totalCount: string // 전체 결과 수
  ) {}
}

// 실거래가 통합 응답 Entity
export class RealEstateTransactionResponse {
  constructor(
    public header: RealEstateTransactionResponseHeader,
    public body: RealEstateTransactionResponseBody
  ) {}
}
