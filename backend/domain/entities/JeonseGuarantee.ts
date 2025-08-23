/**
 * 전세자금보증상품 조회 API Entity
 * 공공데이터포털 API 실제 응답 구조 기반
 */

// 전세자금보증상품 통합 응답 Entity
export class JeonseGuaranteeEntity {
  constructor(
    // 헤더 정보
    public resultCode: string, // 결과코드 (예: "00")
    public resultMsg: string, // 결과메시지 (예: "정상")
    
    // 바디 정보
    public pageNo: number, // 페이지 번호 (4자)
    public totalCount: number, // 데이터 총 개수 (4자)
    public numOfRows: number, // 한 페이지 결과 수 (4자)
    public items: Array<{
      rcmdProrRnk: number, // 추천우선순위
      grntLmtAmt: string, // 최대보증한도(고객별) - 문자열로 반환됨
      loanLmtAmt: string, // 최대대출한도(고객별) - 문자열로 반환됨
      grntDvcd: string // 보증구분코드
    }> // 전세자금보증상품 목록
  ) {}
}


