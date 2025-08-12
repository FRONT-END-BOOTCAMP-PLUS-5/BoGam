import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { DanJiSerialNumberRepository } from '@be/domain/repository/DanjiSerialNumberRepository';
import { DanJiSerialNumberRequest } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberRequest';
import { GetDanJiSerialNumberResponse } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberResponse';
import { processResponse } from '@libs/responseUtils';

/**
 * 단지 일련번호 조회 API 인프라스트럭처
 * 클린 아키텍처의 Infrastructure 레이어
 * 순수하게 API 호출과 HTTP 통신만 담당
 */
export class DanJiSerialNumberRepositoryImpl
  implements DanJiSerialNumberRepository
{
  private codefAuth: CodefAuth;
  private readonly baseUrl: string;
  private readonly timeout: number = 100000; // 100초

  constructor() {
    // CODEF 인증 인스턴스 생성
    this.codefAuth = createCodefAuth();

    this.baseUrl = process.env.CODEF_API_URL || 'https://development.codef.io';
  }

  /**
   * 단지 일련번호 조회 API 호출
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getDanJiSerialNumber(
    request: DanJiSerialNumberRequest
  ): Promise<GetDanJiSerialNumberResponse> {
    try {
      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      console.log('request', request);

      // API 요청 실행
      const response = await axios.post(
        CODEF_API_CONFIG.DANJI_FULL_URL,
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
      const data: GetDanJiSerialNumberResponse =
        processResponse<GetDanJiSerialNumberResponse>(response.data);

      console.log('✅ 단지 일련번호 조회 성공:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
        dataCount: data?.data?.length || 0,
      });

      return data;
    } catch (error: unknown) {
      console.error('❌ 단지 일련번호 조회 실패:', error);
      throw error;
    }
  }
}
