/**
 * 부동산 공시가격 알리미 개별주택 가격 요청 DTO
 */
export interface GetHousingPriceRequestDto {
  organization: string;
  addrSearchType: string; // "0" | "1"
  addrSido?: string;
  addrSiGunGu?: string;
  addrDong?: string;
  type?: string;
  addrLotNumber?: string;
  address?: string;
  addrBuildingNumber?: string;
  searchStartYear?: string; // YYYY
  searchEndYear?: string; // YYYY
  dongNum?: string;
}
