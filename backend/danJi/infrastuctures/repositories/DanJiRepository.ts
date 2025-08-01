import { DanJiRequest } from '../../applications/dtos/DanJiDto';
import { getCodefAuth } from '../../../../utils/codefAuth';
import { decodeCodefResponse } from '../../../../utils/codefDecoder';
import { loadCodefConfig, validateCodefConfig } from '@/lib/config';
import { getCurrentConfig } from '@/libs/codefEnvironment';
import axios from 'axios';
import { DanJiApiResponse } from '../../applications/dtos/DanJiDto';

/**
 * 단지목록 조회 Repository 구현체
 * Infrastructure 레이어에서 실제 CODEF API 호출을 담당
 */
export class DanJiRepository {
  private readonly codefAuth = getCodefAuth();
  private readonly endpoint = '/v1/kr/public/lt/real-estate-board/estate-list';

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

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      console.log('🏢 단지목록 조회 요청 중...', {
        endpoint: this.endpoint,
        organization: request.organization,
        addrSido: request.addrSido,
        addrSigun: request.addrSigun,
        addrDong: request.addrDong,
      });

      const url = `${getCurrentConfig().apiUrl}${this.endpoint}`;

      const response = await axios.post(url, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 300초 (5분)
      });

      // 응답 데이터 디코딩 후 반환
      const decodedResponse = decodeCodefResponse(response);

      console.log(decodedResponse);
      return decodedResponse.data as unknown as DanJiApiResponse;
    } catch (error) {
      console.error('❌ 단지목록 조회 실패:', error);
      throw new Error(`단지목록 조회에 실패했습니다: ${error}`);
    }
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.codefAuth.clearTokenCache();
  }
}
