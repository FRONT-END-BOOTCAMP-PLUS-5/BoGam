import { GetRealEstateDataInfrastructure } from '../../infrastrctures/repositories/GetRealEstateDataInfrastructure';
import {
  DetailInquiryRequest,
  GetRealEstateRequest,
  IssueRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
} from '../dtos/RealEstateRequest';
import { GetRealEstateResponse } from '../dtos/RealEstateResponse';

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
    return this.infrastructure['codefAuth'].getAccessToken();
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.infrastructure['codefAuth'].clearTokenCache();
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
      | DetailInquiryRequest
      | IssueRequest
      | SummaryInquiryRequest
  ): Promise<GetRealEstateResponse> {
    return this.infrastructure.getRealEstateRegistry(request);
  }

  /**
   * 2-way 인증 처리
   * @param uniqueNo 부동산 고유번호
   * @param twoWayInfo 추가인증 정보
   * @returns 응답 데이터
   */
  async processTwoWayAuth(
    uniqueNo: string,
    twoWayInfo: {
      jobIndex: number;
      threadIndex: number;
      jti: string;
      twoWayTimestamp: number;
    }
  ): Promise<GetRealEstateResponse> {
    return this.infrastructure.processTwoWayAuth(uniqueNo, twoWayInfo);
  }

  /**
   * 고유번호로 부동산 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getRealEstateByUniqueNo(
    request: SummaryInquiryRequest
  ): Promise<GetRealEstateResponse> {
    return this.getRealEstateRegistry(request);
  }

  /**
   * 간편검색으로 부동산 검색
   * @param address 검색 주소
   * @param password 비밀번호
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async searchRealEstateByAddress(
    address: string,
    password: string,
    options: {
      realtyType?: string;
      addrSido?: string;
      recordStatus?: string;
      startPageNo?: string;
      pageCount?: string;
      issueType?: string;
      phoneNo?: string;
      organization?: string;
      dong?: string;
      ho?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: DetailInquiryRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '1',
      address,
      realtyType: options.realtyType,
      addr_sido: options.addrSido || '',
      recordStatus: options.recordStatus || '0',
      startPageNo: options.startPageNo,
      pageCount: options.pageCount || '100',
      issueType: options.issueType || '1',
      dong: options.dong || '',
      ho: options.ho || '',
    };

    return this.getRealEstateRegistry(request);
  }

  /**
   * 소재지번으로 부동산 검색
   * @param addrLotNumber 지번
   * @param password 비밀번호
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async searchRealEstateByLotNumber(
    addrLotNumber: string,
    password: string,
    options: {
      realtyType?: string;
      addrSido?: string;
      addrDong?: string;
      inputSelect?: string;
      buildingName?: string;
      dong?: string;
      ho?: string;
      issueType?: string;
      phoneNo?: string;
      organization?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: IssueRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '2',
      addr_lotNumber: addrLotNumber,
      realtyType: options.realtyType,
      addr_sido: options.addrSido || '',
      addr_dong: options.addrDong || '',
      inputSelect: options.inputSelect,
      issueType: options.issueType || '1',
    };

    return this.getRealEstateRegistry(request);
  }

  /**
   * 도로명주소로 부동산 검색
   * @param addrRoadName 도로명
   * @param addrBuildingNumber 건물번호
   * @param password 비밀번호
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async searchRealEstateByRoadAddress(
    request: IssueResultRequest
  ): Promise<GetRealEstateResponse> {
    return this.getRealEstateRegistry(request);
  }

  // ===== 비즈니스 로직 메서드들 =====

  /**
   * 부동산등기부등본 조회 결과 검증
   * @param response API 응답
   * @returns 검증 결과
   */
  validateResponse(response: GetRealEstateResponse): {
    isValid: boolean;
    message: string;
    requiresTwoWayAuth: boolean;
  } {
    if (!response.data) {
      return {
        isValid: false,
        message: '응답 데이터가 올바르지 않습니다.',
        requiresTwoWayAuth: false,
      };
    }

    if (response.result.code !== 'CF-00000') {
      return {
        isValid: false,
        message: response.result.message || 'API 호출에 실패했습니다.',
        requiresTwoWayAuth: response.result.code === 'CF-03002',
      };
    }

    return {
      isValid: true,
      message: '조회가 성공적으로 완료되었습니다.',
      requiresTwoWayAuth: false,
    };
  }

  /**
   * 추가인증 필요 여부 확인
   * @param response API 응답
   * @returns 추가인증 필요 여부
   */
  requiresTwoWayAuth(response: GetRealEstateResponse): boolean {
    if ('continue2Way' in response.data) {
      return response.data.continue2Way === true;
    }
    return false;
  }

  /**
   * 주소 리스트에서 선택 가능한 부동산 정보 추출
   * @param response API 응답
   * @returns 선택 가능한 부동산 목록
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

    // RealEstateRegisterResponse 타입인지 확인
    if ('resAddrList' in data && data.resAddrList) {
      return data.resAddrList.map((item: any) => ({
        uniqueNo: item.commUniqueNo,
        address: item.commAddrLotNumber,
        owner: item.resUserNm || '',
        state: item.resState,
        type: item.resType || '',
      }));
    }

    // TwoWayResponse 타입인지 확인
    if ('extraInfo' in data && data.extraInfo?.resAddrList) {
      return data.extraInfo.resAddrList.map((item: any) => ({
        uniqueNo: item.commUniqueNo,
        address: item.commAddrLotNumber,
        owner: item.resUserNm || '',
        state: item.resState,
        type: item.resType || '',
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
