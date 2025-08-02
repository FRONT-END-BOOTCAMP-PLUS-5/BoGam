import { DanJiRequest } from '@be/applications/danJi/dtos/DanJiDto';
import { CodefAuth, createCodefAuth } from '@libs/codefAuth';
import { processResponse } from '@libs/responseUtils';
import { loadCodefConfig, validateCodefConfig } from '@libs/codefEnvironment';
import axios from 'axios';
import { DanJiApiResponse } from '@be/applications/danJi/dtos/DanJiDto';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';

/**
 * 단지목록 조회 Repository 구현체
 * Infrastructure 레이어에서 실제 CODEF API 호출을 담당
 */
export class DanJiRepository {
  private codefAuth!: CodefAuth;
  private readonly endpoint = CODEF_API_CONFIG.DANJI_FULL_URL;

  /**
   * 단지목록 조회
   * @param request 단지목록 조회 요청 데이터
   * @returns 단지목록 조회 응답 데이터
   */
  async fetchDanJiList(request: DanJiRequest): Promise<DanJiApiResponse> {
    try {
      // CODEF 설정 검증
      const config = loadCodefConfig();
      validateCodefConfig(config);

      this.codefAuth = createCodefAuth();

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      console.log('🏢 단지목록 조회 요청 중...', {
        endpoint: this.endpoint,
        organization: request.organization,
        addrSido: request.addrSido,
        addrSigun: request.addrSigun,
        addrDong: request.addrDong,
      });

      const url = `${this.endpoint}`;

      const response = await axios.post(url, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 300초 (5분)
      });

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: DanJiApiResponse = processResponse<DanJiApiResponse>(
        response.data
      );

      console.log('✅ 단지목록 조회 성공:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
      });

      return data;
    } catch (error) {
      console.error('❌ 단지목록 조회 실패:', error);
      throw new Error(`단지목록 조회에 실패했습니다: ${error}`);
    }
  }
}
