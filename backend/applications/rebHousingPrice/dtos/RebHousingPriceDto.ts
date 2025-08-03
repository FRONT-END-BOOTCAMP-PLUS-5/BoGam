import { RebHousingPriceEntity } from '@be/domain/entities/RebHousingPriceEntity';

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 요청 DTO
 */
export interface RebHousingPriceRequest {
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
}

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 2-way 인증 요청 DTO
 */
export interface RebHousingPriceTwoWayRequest extends RebHousingPriceRequest {
  is2Way: boolean; // 추가 요청임을 알리는 설정값 (true 고정)
  secureNo?: string; // 보안문자
  secureNoRefresh?: string; // 보안문자 새로고침 ("0": 기본, "1": 재요청, "2": 입력취소)
  twoWayInfo: {
    jobIndex: number; // 잡 인덱스
    threadIndex: number; // 스레드 인덱스
    jti: string; // 트랜잭션 아이디
    twoWayTimestamp: number; // 추가 인증 시간
  };
}

/**
 * 2-way 인증 응답 DTO
 */
export interface TwoWayResponse {
  continue2Way: boolean; // 추가 인증 필요 유무
  method: string; // 추가 인증 방식
  jobIndex: number; // 잡 인덱스
  threadIndex: number; // 스레드 인덱스
  jti: string; // 트랜잭션 아이디
  twoWayTimestamp: number; // 추가 인증 시간
  extraInfo: {
    reqSecureNo?: string; // 보안문자
    reqSecureNoRefresh?: string; // 보안문자 새로고침
  };
}

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 API 응답 DTO
 */
export interface RebHousingPriceApiResponse {
  result: {
    code: string;
    message: string;
  };
  data: RebHousingPriceEntity | TwoWayResponse;
}

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 검증 DTO
 */
export interface RebHousingPriceValidationDto {
  isValid: boolean;
  errors: string[];
}
