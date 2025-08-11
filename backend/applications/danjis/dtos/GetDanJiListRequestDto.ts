/**
 * 단지목록 조회 요청 DTO
 */
export interface GetDanJiListRequestDto {
  organization: string; // 기관코드
  addrSido: string; // 주소_시/도
  addrSigun: string; // 주소_시군구
  addrDong: string; // 주소_읍면동
}
