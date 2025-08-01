import axios from 'axios';
import { CodefAuth, createCodefAuth } from '../../../libs/codefAuth';
import { decodeCodefResponse } from '../../../utils/codefDecoder';
import {
  loadCodefConfig,
  validateCodefConfig,
} from '../../../libs/codefEnvironment';
import { SiseApiResponse, SiseRequest } from '../../applications/sise/dtos/SiseDto';
import { getCurrentConfig } from '../../../libs/codefEnvironment';
import { CODEF_API_CONFIG } from '../../../libs/api-endpoints';

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
  async fetchSiseInfo(request: SiseRequest): Promise<SiseApiResponse> {
    try {
      // CODEF 설정 검증
      const config = loadCodefConfig();
      validateCodefConfig(config);

      this.codefAuth = createCodefAuth();

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      console.log('💰 시세정보 조회 요청 중...', {
        endpoint: this.endpoint,
        organization: request.organization,
        searchGbn: request.searchGbn,
        complexNo: request.complexNo,
        dong: request.dong,
        ho: request.ho,
        is2Way: 'is2Way' in request ? request.is2Way : false,
      });

      const url = `${this.endpoint}`;

      const response = await axios.post(url, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 300초 (5분)
      });

      console.log(response);

      // 응답 데이터 디코딩 후 반환
      const decodedResponse = decodeCodefResponse(
        response as unknown as string
      );

      return decodedResponse.data as unknown as SiseApiResponse;
    } catch (error) {
      console.error('❌ 시세정보 조회 실패:', error);
      throw new Error(`시세정보 조회에 실패했습니다: ${error}`);
    }
  }
}
