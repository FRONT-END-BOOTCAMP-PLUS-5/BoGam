/**
 * 단지 일련번호 조회 API 요청 DTO
 */

export interface DanjiSerialNumberRequestDto {
  organization: '0010'; // 기관코드 (고정 값: "0010")
  year: string; // 기준년도 (YYYY)
  type: string; // 구분 ("0":아파트, "1":연립/다세대, "2":오피스텔)
  searchGbn: string; // 조회구분 ("0":지번주소, "1":도로명주소)
  addrSido: string; // 주소_시도
  addrSigungu: string; // 주소_시군구
  addrDong: string; // 주소_읍면동로 (지번주소인 경우 읍면동명, 도로명주소인경우 도로명주소 입력)
  complexName?: string; // 단지명 (선택사항)
}
