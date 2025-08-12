/**
 * 단지 일련번호 조회 API 응답 DTO
 */

export interface GetDanjiSerialNumberResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: {
    danjiList: DanjiInfo[];
  };
}

export interface DanjiInfo {
  danjiCode: string; // 단지코드
  danjiName: string; // 단지명
  address: string; // 주소
  constructionCompany: string; // 건설사
  completionDate: string; // 준공일
  totalHouseholds: number; // 총세대수
  serialNumber: string; // 일련번호
}
