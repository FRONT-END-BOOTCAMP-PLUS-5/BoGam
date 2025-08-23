/**
 * 전세자금보증상품 조회 요청 DTO
 * 공공데이터포털 API 명세 기반
 */

export interface GetJeonseGuaranteeRequestDto {
  // 필수 파라미터 (항목구분: 1)
  numOfRows: number; // 한 페이지 결과 수 (4자, 기본값: 100)
  pageNo: number; // 페이지 번호 (4자, 기본값: 1)
  rentGrntAmt: number; // 임차보증금액 (18자, 원 단위)
  mmrtAmt: number; // 월세금액 (18자, 원 단위, 없는 경우 0 입력)
  trgtLwdgCd: string; // 목적물주소 법정동코드 (10자, 시군구 단위)
  age: number; // 만 나이 (3자, 0~150)
  weddStcd: number; // 결혼구분 (1자, 1:미혼, 2:기혼, 3:신혼, 4:결혼예정)
  myIncmAmt: number; // 연소득금액 (15자, 원 단위)
  myTotDebtAmt: number; // 총부채금액 (15자, 원 단위)
  ownHsCnt: number; // 주택보유수 (10자, 0 이상)

  // 옵션 파라미터 (항목구분: 0)
  grntPrmeActnDvcdCont?: string; // 보증우대조치구분 (300자, 복수 선택 시 쉼표로 구분)
}
