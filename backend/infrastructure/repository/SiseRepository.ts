import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { processResponse } from '@libs/responseUtils';
import { loadCodefConfig, validateCodefConfig } from '@libs/codef/codefConfig';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { GetSiseInfoRequestDto } from '@be/applications/sises/dtos/GetSiseInfoRequestDto';
import { GetSiseInfoResponseDto } from '@be/applications/sises/dtos/GetSiseInfoResponseDto';

/**
 * 시세정보 조회 Repository 구현체
 * Infrastructure 레이어에서 실제 CODEF API 호출을 담당
 */
export class SiseRepository {
  private codefAuth!: CodefAuth;
  private readonly endpoint = CODEF_API_CONFIG.SISE_FULL_URL;

  /**
   * 시세정보 조회
   * @param request 시세정보 조회 요청 데이터
   * @returns 시세정보 조회 응답 데이터
   */
  async fetchSiseInfo(
    request: GetSiseInfoRequestDto
  ): Promise<GetSiseInfoResponseDto> {
    try {
      // CODEF 설정 검증
      const config = loadCodefConfig();
      validateCodefConfig(config);

      this.codefAuth = createCodefAuth();

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      const url = `${this.endpoint}`;

      const response = await axios.post(url, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 300초 (5분)
      });

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: GetSiseInfoResponseDto =
        processResponse<GetSiseInfoResponseDto>(response.data);

      return data;
    } catch (error) {
      console.error('❌ 시세정보 조회 실패:', error);
      throw new Error(`시세정보 조회에 실패했습니다: ${error}`);
    }
  }
}
