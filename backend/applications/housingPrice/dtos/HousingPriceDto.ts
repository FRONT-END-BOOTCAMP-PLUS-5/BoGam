import { HousingPriceEntity } from '@be/domain/entities/HousingPriceEntity';

/**
 * 부동산 공시가격 알리미 개별주택 가격 요청 DTO
 */
export interface HousingPriceRequest {
  organization: string; // 기관코드 (고정 값: "0001")
  addrSearchType: string; // 주소검색 구분 ("0":지번입력조회, "1":도로명주소입력조회)
  addrSido?: string; // 주소_시/도
  addrSiGunGu?: string; // 주소_시군구 (addrSearchType="0" 필수)
  addrDong?: string; // 주소_읍면동로 (addrSearchType="0" 필수)
  type?: string; // 구분 (지번구분, addrSearchType="0" 필수)
  addrLotNumber?: string; // 주소_지번 (addrSearchType="0" 필수)
  address?: string; // 주소 (addrSearchType="1" 필수)
  addrBuildingNumber?: string; // 주소_건물번호
  searchStartYear?: string; // 조회 시작 년도 (YYYY)
  searchEndYear?: string; // 조회 종료 년도 (YYYY)
  dongNum?: string; // 동번호
}

/**
 * 부동산 공시가격 알리미 개별주택 가격 API 응답 DTO
 */
export interface HousingPriceApiResponse {
  result: {
    code: string;
    message: string;
  };
  data: HousingPriceEntity;
}

/**
 * 부동산 공시가격 알리미 개별주택 가격 검증 DTO
 */
export interface HousingPriceValidationDto {
  isValid: boolean;
  errors: string[];
}
