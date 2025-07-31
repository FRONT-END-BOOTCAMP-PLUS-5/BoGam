import axios, { AxiosResponse, AxiosError } from 'axios';
import { getCodefAuth } from '../../../../utils/codefAuth';
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
  private readonly codefAuth = getCodefAuth();
  private readonly baseUrl: string;
  private readonly timeout: number = 300000; // 5분 (등기부등본 API는 시간이 오래 걸림)

  constructor() {
    this.baseUrl = process.env.CODEF_API_URL || 'https://api.codef.io';
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
  async processTwoWayAuth(
    uniqueNo: string,
    twoWayInfo: {
      jobIndex: number;
      threadIndex: number;
      jti: string;
      twoWayTimestamp: number;
    }
  ): Promise<GetRealEstateResponse> {
    try {
      console.log('🔐 2-way 인증 처리 시작:', { uniqueNo });

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      const twoWayRequest = {
        uniqueNo,
        is2Way: true,
        twoWayInfo,
      };

      // API 요청 실행
      const response: AxiosResponse<GetRealEstateResponse> = await axios.post(
        `https://development.codef.io/v1/kr/public/ck/real-estate-register/status`,
        twoWayRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CodefSandbox/1.0',
          },
          timeout: 120000, // 2-way 인증은 2분 타임아웃
        }
      );

      console.log('✅ 2-way 인증 처리 성공:', {
        uniqueNo,
        resultCode: response.data.result?.code,
      });

      return response.data;
    } catch (error: unknown) {
      console.error('❌ 2-way 인증 처리 실패:', error);
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 고유번호로 부동산 조회
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
    const request: GetRealEstateRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '2',
      addr_lotNumber: addrLotNumber,
      realtyType: options.realtyType,
      addr_sido: options.addrSido || '',
      addr_dong: options.addrDong || '',
      inputSelect: options.inputSelect,
      issueReason: '열람', // 필수 필드
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
    addrRoadName: string,
    addrBuildingNumber: string,
    password: string,
    options: {
      realtyType?: string;
      addrSido?: string;
      addrSigungu?: string;
      dong?: string;
      ho?: string;
      issueType?: string;
      phoneNo?: string;
      organization?: string;
    } = {}
  ): Promise<GetRealEstateResponse> {
    const request: IssueResultRequest = {
      organization: options.organization || '0002',
      phoneNo: options.phoneNo || '01000000000',
      password,
      inquiryType: '3',
      addr_roadName: addrRoadName,
      addr_buildingNumber: addrBuildingNumber,
      realtyType: options.realtyType,
      addr_sido: options.addrSido || '',
      addr_sigungu: options.addrSigungu || '',
      originData: '', // 필수 필드
      originDataYN: '0',
      issueType: options.issueType || '1',
      dong: options.dong || '',
      ho: options.ho || '',
    };

    return this.getRealEstateRegistry(request);
  }

  /**
   * 에러 처리
   * @param error 에러 객체
   */
  private handleError(error: AxiosError | Error): void {
    if ('response' in error && error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response;
      console.error('API 응답 에러:', {
        status,
        code: (data as any)?.result?.code,
        message: (data as any)?.result?.message,
      });

      // 특정 에러 코드에 대한 처리
      switch ((data as any)?.result?.code) {
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

  /**
   * 응답 데이터의 URL 디코딩 및 JSON 파싱 처리
   * @param response 원본 응답 데이터
   * @returns 디코딩된 응답 데이터
   */
  private decodeBase64Response(
    data: GetRealEstateResponse
  ): GetRealEstateResponse {
    try {
      // 깊은 복사로 원본 데이터 보존
      let decodedData = JSON.parse(JSON.stringify(data));

      // data 필드가 URL 인코딩된 문자열인 경우 디코딩
      if (decodedData && typeof decodedData === 'string') {
        try {
          // URL 디코딩
          const urlDecodedData = decodeURIComponent(decodedData);

          // JSON 파싱
          const jsonData = JSON.parse(urlDecodedData);

          // 디코딩된 JSON 데이터로 교체
          decodedData = jsonData.data;
          decodedData.result = jsonData.result;
          return decodedData;
        } catch (decodeError) {
          console.warn(
            '⚠️ URL 디코딩 또는 JSON 파싱 실패, 원본 데이터 유지:',
            decodeError
          );
        }
      }

      return decodedData;
    } catch (error) {
      console.error('❌ 응답 디코딩 처리 실패:', error);
      return data; // 오류 시 원본 응답 반환
    }
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.codefAuth.clearTokenCache();
  }
}
