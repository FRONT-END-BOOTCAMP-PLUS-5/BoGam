/**
 * 실거래가 조회 API 요청 DTO
 */
export interface TransactionDetailApartRequest {
  organization: string; // 고정값: "0010"
  type: string; // "0": 아파트, "1": 연립/다세대, "2": 오피스텔
  buildingCode: string; // 단지일련번호 조회 API 결과값
  contractYear: string; // YYYY (2006년부터)
  contractType: string; // "0":전체, "1":매매, "2":전월세 (default: 0)
}
