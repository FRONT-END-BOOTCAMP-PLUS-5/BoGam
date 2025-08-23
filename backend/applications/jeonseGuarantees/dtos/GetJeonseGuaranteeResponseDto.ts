/**
 * 전세자금보증상품 조회 응답 DTO
 * 공공데이터포털 API 실제 응답 구조 기반
 */

export interface JeonseGuaranteeItemDto {
  rcmdProrRnk: number; // 추천우선순위 (2자)
  grntDvcd: string; // 보증구분코드 (2자)
  loanLmtAmt: string; // 최대대출한도(고객별) (15자) - 문자열로 반환됨
  grntLmtAmt: string; // 최대보증한도(고객별) (15자) - 문자열로 반환됨
}

export interface JeonseGuaranteeHeaderDto {
  resultCode: string; // 결과코드 (2자, 예: "00")
  resultMsg: string; // 결과메시지 (50자, 예: "NORMAL SERVICE")
}

export interface GetJeonseGuaranteeResponseDto {
  header: JeonseGuaranteeHeaderDto;
  items: JeonseGuaranteeItemDto[]; // 전세자금보증상품 목록
  numOfRows: number; // 한 페이지 결과 수 (4자)
  pageNo: number; // 페이지 번호 (4자)
  totalCount: number; // 데이터 총 개수 (4자)
}
