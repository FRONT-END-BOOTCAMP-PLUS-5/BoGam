/**
 * 부동산등기부등본 조회 API Route 요청 DTO
 * 사용자 친화적인 요청을 받아서 내부적으로 GetRealEstateRequest로 변환
 */

// 공통 요청 필드
export interface BaseRealEstateRouteRequest {
  password: string; // 비밀번호 (4자리 숫자)
  phoneNo?: string; // 전화번호 (기본값: 01000000000)
  organization?: string; // 기관코드 (기본값: 0002)
  issueType?: string; // 발행구분 (기본값: '1')
}

// 고유번호로 조회 요청
export interface GetByUniqueNoRequest extends BaseRealEstateRouteRequest {
  uniqueNo: string; // 부동산 고유번호 (14자리)
}

// 간편검색 요청
export interface SearchByAddressRequest extends BaseRealEstateRouteRequest {
  address: string; // 검색 주소 (최소 3자리)
  realtyType?: string; // 부동산 구분
  addrSido?: string; // 주소 시/도
  recordStatus?: string; // 등기 기록 상태 (기본값: '0')
  startPageNo?: string; // 시작 페이지 번호
  pageCount?: string; // 조회 페이지 수 (기본값: '100')
  dong?: string; // 동
  ho?: string; // 호
}

// 소재지번으로 검색 요청
export interface SearchByLotNumberRequest extends BaseRealEstateRouteRequest {
  addrLotNumber: string; // 지번
  realtyType?: string; // 부동산 구분
  addrSido?: string; // 주소 시/도
  addrDong?: string; // 주소 읍면동로
  inputSelect?: string; // 입력 선택
}

// 도로명주소로 검색 요청
export interface SearchByRoadAddressRequest extends BaseRealEstateRouteRequest {
  addrRoadName: string; // 도로명
  addrBuildingNumber: string; // 건물번호
  realtyType?: string; // 부동산 구분
  addrSido?: string; // 주소 시/도
  addrSigungu?: string; // 주소 시군구
}

// 2-way 인증 요청
export interface TwoWayAuthRequest {
  uniqueNo: string; // 부동산 고유번호
  twoWayInfo: {
    jobIndex: number; // 잡 인덱스
    threadIndex: number; // 스레드 인덱스
    jti: string; // 트렌젝션 아이디
    twoWayTimestamp: number; // 추가 인증 시간
  };
}

// 통합 요청 타입
export type RealEstateRouteRequest =
  | GetByUniqueNoRequest
  | SearchByAddressRequest
  | SearchByLotNumberRequest
  | SearchByRoadAddressRequest;
