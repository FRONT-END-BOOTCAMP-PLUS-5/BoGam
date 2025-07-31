/**
 * 부동산등기부등본 조회 API Route 응답 DTO
 */

// 공통 응답 필드
export interface BaseRealEstateRouteResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// 성공 응답
export interface RealEstateSuccessResponse extends BaseRealEstateRouteResponse {
  success: true;
  data: {
    // 발행 관련
    issueCode?: string;
    issueStatus: string;
    issueMessage: string;
    publishNo?: string;
    publishDate?: string;
    publishOffice?: string;

    // 페이지 관련
    totalPageCount?: string;
    startPageNo?: string;
    endPageNo?: string;

    // 주소 정보
    selectableAddresses?: Array<{
      uniqueNo: string;
      address: string;
      owner: string;
      state: string;
      type: string;
    }>;

    // 등기사항 정보
    registrationSummary?: Array<{
      type: string;
      typeDetail: string;
      contents: Array<{
        number: string;
        type: string;
        details: Array<{
          number: string;
          content: string;
        }>;
      }>;
    }>;

    // 원문 데이터
    originalData?: string; // PDF BASE64
  };
}

// 2-way 인증 필요 응답
export interface TwoWayAuthRequiredResponse
  extends BaseRealEstateRouteResponse {
  success: false;
  requiresTwoWayAuth: true;
  twoWayInfo: {
    method: string;
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    selectableAddresses: Array<{
      uniqueNo: string;
      address: string;
      owner: string;
      state: string;
      type: string;
    }>;
  };
}

// 에러 응답
export interface RealEstateErrorResponse extends BaseRealEstateRouteResponse {
  success: false;
  requiresTwoWayAuth: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// 통합 응답 타입
export type RealEstateRouteResponse =
  | RealEstateSuccessResponse
  | TwoWayAuthRequiredResponse
  | RealEstateErrorResponse;
