import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { loadCodefConfig, validateCodefConfig } from '@libs/codef/codefConfig';
import { GetRealEstatesRequestDto } from '@be/applications/realEstates/dtos/GetRealEstatesRequestDto';
import { GetRealEstatesResponseDto } from '@be/applications/realEstates/dtos/GetRealEstatesResponseDto';
import { processResponse } from '@libs/responseUtils';

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
    request: GetRealEstatesRequestDto
  ): Promise<GetRealEstatesResponseDto> {
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

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: GetRealEstatesResponseDto =
        processResponse<GetRealEstatesResponseDto>(response.data);

      console.log('✅ 부동산등기부등본 조회 성공:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
      });

      return data;
    } catch (error: unknown) {
      console.error('❌ 부동산등기부등본 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 2-way 인증 처리 API 호출
   * @param twoWayRequest 2-way 인증 요청 데이터 (원본 요청 + 2-way 인증 정보)
   * @returns 응답 데이터
   */
  async handleTwoWayAuth(
    twoWayRequest: Record<string, unknown>
  ): Promise<GetRealEstatesResponseDto> {
    try {
      const accessToken = await this.codefAuth.getAccessToken();

      // twoWayRequest에 is2Way 플래그 추가
      const requestWithFlag = {
        ...twoWayRequest,
        is2Way: true,
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/kr/public/ck/real-estate-register/status`,
        requestWithFlag,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'CodefSandbox/1.0',
          },
          timeout: 120000, // 2분 (2-way 인증은 시간이 짧음)
        }
      );

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: GetRealEstatesResponseDto =
        processResponse<GetRealEstatesResponseDto>(response.data);

      console.log('✅ 2-way 인증 처리 성공:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
      });

      return data;
    } catch (error: unknown) {
      console.error('❌ 2-way 인증 처리 실패:', error);
      throw error;
    }
  }
}
