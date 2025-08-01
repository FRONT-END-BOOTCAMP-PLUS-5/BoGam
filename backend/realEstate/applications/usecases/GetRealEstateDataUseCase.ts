import { GetRealEstateDataInfrastructure } from '../../infrastrctures/repositories/GetRealEstateDataInfrastructure';
import {
  GetRealEstateRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
  DetailInquiryRequest,
} from '../dtos/GetRealEstateRequest';
import { GetRealEstateResponse } from '../dtos/GetRealEstateResponse';

/**
 * 부동산등기부등본 조회 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class GetRealEstateDataUseCase {
  private readonly infrastructure: GetRealEstateDataInfrastructure;

  constructor() {
    this.infrastructure = new GetRealEstateDataInfrastructure();
  }

  // ===== 인증 관련 =====

  /**
   * 액세스 토큰 획득
   */
  async getAccessToken(): Promise<string> {
    return this.infrastructure.getAccessToken();
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.infrastructure.clearTokenCache();
  }

  // ===== 부동산등기부등본 API =====

  /**
   * 부동산등기부등본 조회/발급
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getRealEstateRegistry(
    request: IssueResultRequest | SummaryInquiryRequest | DetailInquiryRequest | GetRealEstateRequest
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
   * API 응답 검증
   * @param response API 응답
   * @returns 검증 결과
   */
  validateResponse(response: GetRealEstateResponse): {
    isValid: boolean;
    message?: string;
    requiresTwoWayAuth?: boolean;
  } {
    // 응답 코드 확인
    if (!response.result) {
      return { isValid: false, message: '응답 형식이 올바르지 않습니다.' };
    }

    const { code, message } = response.result;

    // 성공 코드 확인
    if (code === 'CF-00000') {
      return { isValid: true };
    }

    // 추가인증 필요 (CF-03002)
    if (code === 'CF-03002') {
      return {
        isValid: false,
        requiresTwoWayAuth: true,
        message: message || '추가인증이 필요합니다.',
      };
    }

    // 기타 오류
    return {
      isValid: false,
      message: message || `API 오류: ${code}`,
    };
  }

  /**
   * 2-way 인증 필요 여부 확인
   * @param response API 응답
   * @returns 2-way 인증 필요 여부
   */
  requiresTwoWayAuth(response: GetRealEstateResponse): boolean {
    return (
      response.result?.code === 'CF-03002' ||
      (response.data && 'continue2Way' in response.data && response.data.continue2Way === true)
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
    extraInfo?: any;
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

  // ===== 응답 데이터 추출 =====

  /**
   * 등기부등본 문서 정보 추출
   * @param response API 응답
   * @returns 등기부등본 문서 정보
   */
  getDocuments(response: GetRealEstateResponse): Array<{
    title: string;
    realtyName: string;
    uniqueNo: string;
    publishDate: string;
    registryOffice: string;
    publishNo?: string;
  }> {
    const data = response.data;
    if (!data) {
      return [];
    }

    // RealEstateRegisterResponse 타입인지 확인
    if ('resRegisterEntriesList' in data && data.resRegisterEntriesList) {
      return data.resRegisterEntriesList.map((entry: any) => ({
        title: entry.resDocTitle,
        realtyName: entry.resRealty,
        uniqueNo: entry.commUniqueNo,
        publishDate: entry.resPublishDate,
        registryOffice: entry.commCompetentRegistryOffice,
        publishNo: entry.resPublishNo,
      }));
    }

    return [];
  }

  /**
   * 선택 가능한 주소 목록 추출
   * @param response API 응답
   * @returns 주소 목록
   */
  getSelectableAddresses(response: GetRealEstateResponse): Array<{
    uniqueNo: string;
    address: string;
    owner: string;
    state: string;
    type: string;
  }> {
    const data = response.data;
    if (!data) {
      return [];
    }

    // 추가인증에서 주소 목록 확인
    if (data.extraInfo && data.extraInfo.resAddrList) {
      return data.extraInfo.resAddrList.map((addr: any) => ({
        uniqueNo: addr.commUniqueNo,
        address: addr.commAddrLotNumber,
        owner: addr.resUserNm || '',
        state: addr.resState,
        type: addr.resType || '',
      }));
    }

    // 일반 응답에서 주소 목록 확인
    if (data.resAddrList) {
      return data.resAddrList.map((addr: any) => ({
        uniqueNo: addr.commUniqueNo,
        address: addr.commAddrLotNumber,
        owner: addr.resUserNm || '',
        state: addr.resState,
        type: addr.resType || '',
      }));
    }

    return [];
  }

  /**
   * 등기사항 요약 정보 추출
   * @param response API 응답
   * @returns 등기사항 요약 정보
   */
  getRegistrationSummary(response: GetRealEstateResponse): Array<{
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
  }> {
    const data = response.data;
    if (!data) {
      return [];
    }

    // RealEstateRegisterResponse 타입인지 확인
    if ('resRegisterEntriesList' in data && data.resRegisterEntriesList) {
      return data.resRegisterEntriesList.flatMap((entry: any) =>
        entry.resRegistrationSumList.map((summary: any) => ({
          type: summary.resType,
          typeDetail: summary.resType1 || '',
          contents: summary.resContentsList.map((content: any) => ({
            number: content.resNumber || '',
            type: content.resType2 || '',
            details:
              content.resDetailList?.map((detail: any) => ({
                number: detail.resNumber || '',
                content: detail.resContents || '',
              })) || [],
          })),
        }))
      );
    }

    return [];
  }
}