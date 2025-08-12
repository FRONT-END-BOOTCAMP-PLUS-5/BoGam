/**
 * 부동산 공시가격 알리미 공동주택 공시가격 요청 DTO
 */
export interface GetRebHousingPriceListRequestDto {
  organization: string; // 기관코드 (고정 값: "0007")
  addrSearchType: string; // 주소검색 구분 ("0":지번입력조회, "1":도로명주소입력조회)
  addrSido: string; // 주소_시/도
  addrSiGunGu: string; // 주소_시군구
  addrDong?: string; // 주소_읍면동로 (addrSearchType="0" 필수)
  addrLotNumber?: string; // 주소_지번 (addrSearchType="0" 필수)
  addrRoadName?: string; // 주소_도로명 (addrSearchType="1" 필수)
  addrBuildingNumber?: string; // 주소_건물번호 (addrSearchType="1" 필수)
  searchStartYear?: string; // 조회 시작 년도 (YYYY)
  searchEndYear?: string; // 조회 종료 년도 (YYYY)

  // 2-way 인증 관련 (선택적)
  is2Way?: boolean;
  secureNo?: string;
  secureNoRefresh?: string;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
}
