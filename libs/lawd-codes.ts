/**
 * 법정동코드 (LAWD_CD) 상수
 * 공공데이터포털 실거래가 API에서 사용하는 지역코드
 */

export interface LawdCode {
    code: string;
    name: string;
    sido: string;
    sigungu: string;
    dong?: string;
  }