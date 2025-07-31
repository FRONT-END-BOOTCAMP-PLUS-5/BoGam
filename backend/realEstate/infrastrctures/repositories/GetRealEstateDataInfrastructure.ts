import axios, { AxiosResponse, AxiosError } from 'axios';
import { createCodefAuth } from '../../../../libs/codefAuth';
import { loadCodefConfig, validateCodefConfig } from '../../../../libs/codefEnvironment';
import {
  DetailInquiryRequest,
  GetRealEstateRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
} from '../../applications/dtos/GetRealEstateRequest';
import { GetRealEstateResponse } from '../../applications/dtos/GetRealEstateResponse';

/**
 * 부동산등기부등본 조회 API 인프라스트럭처
 * 클린 아키텍처의 Infrastructure 레이어
 */
export class GetRealEstateDataInfrastructure {
  private readonly codefAuth;
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
    this.codefAuth = createCodefAuth({
      clientId: config.oauth.clientId,
      clientSecret: config.oauth.clientSecret,
      baseUrl: config.oauth.baseUrl,
    });
    
    this.baseUrl = process.env.CODEF_API_URL || 'https://development.codef.io';
  }

  /**
   * 부동산등기부등본 조회/발급
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
      const response: AxiosResponse<GetRealEstateResponse> = await axios.post(
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

      // 응답 데이터에서 base64 URL 디코딩 처리
      const decodedData = this.decodeBase64Response(response.data);

      return decodedData;
    } catch (error) {
      console.error('❌ 부동산등기부등본 조회 실패:', error);
      this.handleError(error as AxiosError | Error);
      throw error;
    }
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
    try {
      console.log('🔐 2-way 인증 처리 시작:', { uniqueNo, twoWayInfo });

      const accessToken = await this.codefAuth.getAccessToken();

      const twoWayRequest = {
        uniqueNo,
        is2Way: true,
        twoWayInfo,
      };

      const response: AxiosResponse<GetRealEstateResponse> = await axios.post(
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

      const decodedData = this.decodeBase64Response(response.data);
      console.log('✅ 2-way 인증 처리 완료');

      return decodedData;
    } catch (error) {
      console.error('❌ 2-way 인증 처리 실패:', error);
      this.handleError(error as AxiosError | Error);
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
      addr_sigungu: options.addrSigungu || '',
      addr_dong: options.addrDong || '',
      addr_lotNumber: addrLotNumber,
      realtyType: options.realtyType || '',
      inputSelect: options.inputSelect || '0',
      buildingName: options.buildingName || '',
      dong: options.dong || '',
      ho: options.ho || '',
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
   * Base64 URL 디코딩 처리
   * CODEF API 응답에 포함된 base64 인코딩된 URL을 디코딩
   */
  private decodeBase64Response(data: any): any {
    if (!data) return data;

    try {
      // 재귀적으로 객체 내의 모든 base64 URL 디코딩
      const decoded = this.recursiveBase64Decode(data);
      return decoded;
    } catch (error) {
      console.warn('⚠️ Base64 디코딩 실패, 원본 데이터 반환:', error);
      return data;
    }
  }

  /**
   * 재귀적으로 base64 디코딩
   */
  private recursiveBase64Decode(obj: any): any {
    if (typeof obj === 'string') {
      // base64로 인코딩된 URL 패턴 확인 및 디코딩
      try {
        if (obj.startsWith('data:') || obj.includes('base64,')) {
          return obj; // data URL은 그대로 유지
        }
        // URL 디코딩 시도
        const decoded = decodeURIComponent(obj);
        return decoded !== obj ? decoded : obj;
      } catch {
        return obj;
      }
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.recursiveBase64Decode(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.recursiveBase64Decode(value);
      }
      return result;
    }

    return obj;
  }

  /**
   * 에러 처리
   */
  private handleError(error: AxiosError | Error): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('❌ Axios 에러:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
        data: axiosError.response?.data,
      });
    } else {
      console.error('❌ 일반 에러:', {
        message: error.message,
        stack: error.stack,
      });
    }
  }
}