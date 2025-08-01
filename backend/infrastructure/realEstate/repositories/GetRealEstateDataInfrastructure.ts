import axios from 'axios';
import { CodefAuth, createCodefAuth } from '../../../../libs/codefAuth';
import {
  loadCodefConfig,
  validateCodefConfig,
} from '../../../../libs/codefEnvironment';
import {
  DetailInquiryRequest,
  GetRealEstateRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
} from '../../../applications/realEstate/dtos/RealEstateRequest';
import { GetRealEstateResponse } from '../../../applications/realEstate/dtos/RealEstateResponse';
import { decodeCodefResponse } from '../../../../utils/codefDecoder';

/**
 * 부동산등기부등본 조회 API 인프라스트럭처
 * 클린 아키텍처의 Infrastructure 레이어
 * 순수하게 API 호출과 HTTP 통신만 담당
 */
export class GetRealEstateDataInfrastructure {
  private codefAuth: CodefAuth;
  private readonly baseUrl: string;
  private readonly timeout: number = 300000; // 5분 (등기부등본 API는 시간이 오래 걸림)

  constructor() {
    // CODEF 설정 로드
    const config = loadCodefConfig();
    const validation = validateCodefConfig(config);

    if (!validation.isValid) {
      console.warn('⚠️ CODEF 설정 검증 실패:', validation.errors);
      console.warn('⚠️ 기본 설정으로 진행합니다.');
    }

    // CODEF 인증 인스턴스 생성
    this.codefAuth = createCodefAuth();

    this.baseUrl = process.env.CODEF_API_URL || 'https://development.codef.io';
  }

  /**
   * 부동산등기부등본 조회/발급 API 호출
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getRealEstateRegistry(
    request:
      | IssueResultRequest
      | GetRealEstateRequest
      | SummaryInquiryRequest
      | DetailInquiryRequest
  ): Promise<GetRealEstateResponse> {
    try {
      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      // API 요청 실행
      const response = await axios.post(
        `https://development.codef.io/v1/kr/public/ck/real-estate-register/status`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CodefSandbox/1.0',
          },
          timeout: this.timeout,
        }
      );

      console.log(response);

      const decodedResponse = decodeCodefResponse(
        response as unknown as string
      );

      console.log(decodedResponse);

      // 응답 데이터 디코딩 후 반환
      return decodedResponse.data as unknown as GetRealEstateResponse;
    } catch (error) {
      console.error('❌ 부동산등기부등본 조회 실패:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 2-way 인증 처리 API 호출
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
    try {
      console.log('🔐 2-way 인증 처리 시작:', { uniqueNo, twoWayInfo });

      const accessToken = await this.codefAuth.getAccessToken();

      const twoWayRequest = {
        uniqueNo,
        is2Way: true,
        twoWayInfo,
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/kr/public/ck/real-estate-register/status`,
        twoWayRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CodefSandbox/1.0',
          },
          timeout: 120000, // 2분 (2-way 인증은 시간이 짧음)
        }
      );

      const decodedResponse = decodeCodefResponse(
        response as unknown as string
      );

      console.log('✅ 2-way 인증 처리 완료');

      return decodedResponse.data as unknown as GetRealEstateResponse;
    } catch (error) {
      console.error('❌ 2-way 인증 처리 실패:', error);
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 간단한 메소드들을 제공하는 편의 함수들
   */

  /**
   * 고유번호로 부동산 정보 조회
   * @param uniqueNo 부동산 고유번호
   * @param password 비밀번호
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async getRealEstateByUniqueNo(
    uniqueNo: string,
    password: string,
    options: {
      issueType?: string;
      phoneNo?: string;
      organization?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: GetRealEstateRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '0',
      uniqueNo,
      issueType: options.issueType || '1',
    };

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
    const request: GetRealEstateRequest = {
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
      addrSido?: string;
      addrSigungu?: string;
      addrDong?: string;
      realtyType?: string;
      inputSelect?: string;
      buildingName?: string;
      dong?: string;
      ho?: string;
      issueType?: string;
      phoneNo?: string;
      organization?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: GetRealEstateRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '2',
      addr_sido: options.addrSido || '',
      addr_dong: options.addrDong || '',
      addr_lotNumber: addrLotNumber,
      realtyType: options.realtyType || '',
      inputSelect: options.inputSelect || '0',
      issueType: options.issueType || '1',
    };

    return this.getRealEstateRegistry(request);
  }

  /**
   * 도로명주소로 부동산 검색
   * @param roadName 도로명
   * @param buildingNumber 건물번호
   * @param password 비밀번호
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async searchRealEstateByRoadAddress(
    roadName: string,
    buildingNumber: string,
    password: string,
    options: {
      addrSido?: string;
      addrSigungu?: string;
      realtyType?: string;
      dong?: string;
      ho?: string;
      issueType?: string;
      phoneNo?: string;
      organization?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: GetRealEstateRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '3',
      addr_sido: options.addrSido || '',
      addr_sigungu: options.addrSigungu || '',
      addr_roadName: roadName,
      addr_buildingNumber: buildingNumber,
      realtyType: options.realtyType || '',
      dong: options.dong || '',
      ho: options.ho || '',
      issueType: options.issueType || '1',
      originData: '', // IssueResultRequest 필수 필드
    };

    return this.getRealEstateRegistry(request);
  }

  // ===== 유틸리티 메소드 =====

  /**
   * 액세스 토큰 획득
   */
  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    // 현재 간단한 구현에서는 로그만 출력
    console.log('🔄 토큰 캐시 초기화');
  }

  /**
   * 에러 처리
   * @param error 에러 객체
   */
  private handleError(error: any): void {
    if ('response' in error && error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response;
      console.error('API 응답 에러:', {
        status,
        code: (data as GetRealEstateResponse)?.result?.code,
        message: (data as GetRealEstateResponse)?.result?.message,
      });

      // 특정 에러 코드에 대한 처리
      switch ((data as GetRealEstateResponse)?.result?.code) {
        case 'CF-03002':
          console.log('⚠️ 추가인증이 필요합니다.');
          break;
        case 'CF-13002':
          console.log('⚠️ 전화번호 형식이 올바르지 않습니다.');
          break;
        case 'CF-13007':
          console.log('⚠️ 조회건수가 100건을 초과했습니다.');
          break;
        default:
          console.log('⚠️ 기타 API 에러가 발생했습니다.');
      }
    } else if ('request' in error && error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      console.error('네트워크 에러:', error.message);
    } else {
      // 요청 설정 중 에러
      console.error('요청 설정 에러:', error.message);
    }
  }
}
