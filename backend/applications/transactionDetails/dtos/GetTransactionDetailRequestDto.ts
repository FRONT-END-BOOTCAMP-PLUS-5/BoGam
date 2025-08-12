/**
 * 통합 실거래가 상세조회 요청 DTO
 */
export interface GetTransactionDetailRequestDto {
  organization: string; // 고정값: "0010"
  contractYear: string; // YYYY (2006년부터)
  contractType: string; // "0":전체, "1":매매, "2":전월세 (default: 0)

  // Apart 전용 필드
  apartType?: string; // "0": 아파트, "1": 연립/다세대, "2": 오피스텔 (type이 'apart'일 때 필수)
  buildingCode?: string; // 단지일련번호 조회 API 결과값 (type이 'apart'일 때 필수)

  // Single 전용 필드
  addrSido?: string; // 주소_시도 (type이 'single'일 때 필수)
  addrSigungu?: string; // 주소_시군구 (type이 'single'일 때 필수)
  addrDong?: string; // 주소_읍면동 (type이 'single'일 때 필수)
}

export interface GetTransactionDetailQueryDto {
  type: 'apart' | 'single';
}
