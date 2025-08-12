import axios from 'axios';
import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { processResponse } from '@libs/responseUtils';
import { GetRebHousingPriceListRequestDto } from '@be/applications/rebHousingPrices/dtos/GetRebHousingPriceListRequestDto';
import { GetRebHousingPriceListResponseDto } from '@be/applications/rebHousingPrices/dtos/GetRebHousingPriceListResponseDto';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 Repository 구현체
 * Infrastructure 레이어에서 실제 CODEF API 호출을 담당
 */
export class RebHousingPriceRepository {
  private codefAuth!: CodefAuth;
  private readonly endpoint = CODEF_API_CONFIG.REB_HOUSING_PRICE_FULL_URL;

  /**
   * 부동산 공시가격 알리미 공동주택 공시가격 조회
   * @param request 부동산 공시가격 조회 요청 데이터
   * @returns 부동산 공시가격 조회 응답 데이터
   */
  async getRebHousingPriceList(
    request: GetRebHousingPriceListRequestDto
  ): Promise<GetRebHousingPriceListResponseDto> {
    try {
      this.codefAuth = createCodefAuth();

      // 액세스 토큰 획득
      const accessToken = await this.codefAuth.getAccessToken();

      const url = `${this.endpoint}`;

      const response = await axios.post(url, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 300000, // 300초 (API 문서 기준)
      });

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: GetRebHousingPriceListResponseDto =
        processResponse<GetRebHousingPriceListResponseDto>(response.data);

      return data;
    } catch (error) {
      console.error('❌ 부동산 공시가격(공동주택) 조회 실패:', error);
      throw new Error(
        `부동산 공시가격(공동주택) 조회에 실패했습니다: ${error}`
      );
    }
  }
}
