import axios, { AxiosResponse, AxiosError } from 'axios';
import { getCodefAuth } from '../../../../utils/codefAuth';
import { decodeCodefResponse } from '../../../../utils/codefDecoder';
import {
  DetailInquiryRequest,
  GetRealEstateRequest,
  IssueResultRequest,
  SummaryInquiryRequest,
} from '../../applications/dtos/RealEstateRequest';
import { GetRealEstateResponse } from '../../applications/dtos/RealEstateResponse';

/**
 * 부동산등기부등본 조회 API 인프라스트럭처
 * 클린 아키텍처의 Infrastructure 레이어
 * 순수하게 API 호출과 HTTP 통신만 담당
 */
export class GetRealEstateDataInfrastructure {
  private readonly codefAuth = getCodefAuth();
  private readonly baseUrl: string;
  private readonly timeout: number = 300000; // 5분 (등기부등본 API는 시간이 오래 걸림)

  constructor() {
    this.baseUrl = process.env.CODEF_API_URL || 'https://api.codef.io';
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

      const decodedResponse = decodeCodefResponse(response);

      // 응답 데이터 디코딩 후 반환
      return decodedResponse.data as unknown as GetRealEstateResponse;
    } catch (error) {
      console.error('❌ 부동산등기부등본 조회 실패:', error);
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 2-way 인증 처리 API 호출
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

      // 응답 데이터 디코딩 후 반환
      return decodeCodefResponse(response) as unknown as GetRealEstateResponse;
    } catch (error: unknown) {
      console.error('❌ 2-way 인증 처리 실패:', error);
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.codefAuth.clearTokenCache();
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
