import { CodefAuth, createCodefAuth } from '@libs/codefAuth';
import { GetRealEstateDataInfrastructure } from '@be/infrastructure/repository/GetRealEstateDataInfrastructure';
import {
  DetailInquiryRequest,
  GetRealEstateRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
} from '@be/applications/realEstate/dtos/RealEstateRequest';
import {
  AddressListItem,
  GetRealEstateResponse,
} from '@be/applications/realEstate/dtos/RealEstateResponse';

/**
 * 부동산등기부등본 CODEF API 요청 UseCase
 * 클린 아키텍처의 Application 레이어
 * CODEF API 호출 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class RealEstateUseCase {
  private readonly infrastructure: GetRealEstateDataInfrastructure;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.infrastructure = new GetRealEstateDataInfrastructure();
    this.codefAuth = createCodefAuth();
  }

  // ===== 인증 관련 =====

  /**
   * 액세스 토큰 획득
   */
  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  // ===== 부동산등기부등본 API =====

  /**
   * 부동산등기부등본 조회/발급
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getRealEstateRegistry(
    request:
      | IssueResultRequest
      | SummaryInquiryRequest
      | DetailInquiryRequest
      | GetRealEstateRequest
  ): Promise<GetRealEstateResponse> {
    return this.infrastructure.getRealEstateRegistry(request);
  }

  /**
   * 2-way 인증 처리
   * @param uniqueNo 부동산 고유번호
   * @param twoWayInfo 추가인증 정보
   * @returns 응답 데이터
   */
  async handleTwoWayAuth(
    uniqueNo: string,
    twoWayInfo: {
      jobIndex: number;
      threadIndex: number;
      jti: string;
      twoWayTimestamp: number;
    }
  ): Promise<GetRealEstateResponse> {
    return this.infrastructure.handleTwoWayAuth(uniqueNo, twoWayInfo);
  }

  // ===== 응답 검증 및 처리 =====

  /**
   * 2-way 인증 필요 여부 확인
   * @param response API 응답
   * @returns 2-way 인증 필요 여부
   */
  requiresTwoWayAuth(response: GetRealEstateResponse): boolean {
    return (
      response.result?.code === 'CF-03002' ||
      (response.data &&
        'continue2Way' in response.data &&
        response.data.continue2Way === true)
    );
  }

  /**
   * 2-way 인증 정보 추출
   * @param response API 응답
   * @returns 2-way 인증 정보
   */
  extractTwoWayInfo(response: GetRealEstateResponse): {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: {
      resAddrList?: AddressListItem[];
    };
  } | null {
    const data = response.data;
    if (!data) return null;

    if (
      typeof data.jobIndex === 'number' &&
      typeof data.threadIndex === 'number' &&
      typeof data.jti === 'string' &&
      typeof data.twoWayTimestamp === 'number'
    ) {
      return {
        jobIndex: data.jobIndex,
        threadIndex: data.threadIndex,
        jti: data.jti,
        twoWayTimestamp: data.twoWayTimestamp,
        method: data.method,
        extraInfo: data.extraInfo,
      };
    }

    return null;
  }
} 