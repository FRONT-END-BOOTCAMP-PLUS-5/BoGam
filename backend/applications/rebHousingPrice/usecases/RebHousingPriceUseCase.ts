import { RebHousingPriceRepository } from '@be/infrastructure/repository/RebHousingPriceRepository';
import { RebHousingPriceEntity } from '@be/domain/entities/RebHousingPriceEntity';
import {
  RebHousingPriceRequest,
  RebHousingPriceTwoWayRequest,
  RebHousingPriceApiResponse,
} from '@be/applications/rebHousingPrice/dtos/RebHousingPriceDto';

/**
 * 부동산 공시가격 알리미 공동주택 공시가격 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class RebHousingPriceUseCase {
  private readonly repository: RebHousingPriceRepository;

  constructor(repository: RebHousingPriceRepository) {
    this.repository = repository;
  }

  /**
   * 부동산 공시가격 알리미 공동주택 공시가격 조회
   * @param request 부동산 공시가격 조회 요청 데이터
   * @returns 부동산 공시가격 조회 응답 데이터
   */
  async getRebHousingPrice(
    request: RebHousingPriceRequest | RebHousingPriceTwoWayRequest
  ): Promise<RebHousingPriceApiResponse> {
    // Repository를 통해 API 호출
    return this.repository.getRebHousingPrice(request);
  }

  /**
   * 2-way 인증 필요 여부 확인
   * @param response API 응답
   * @returns 2-way 인증 필요 여부
   */
  requiresTwoWayAuth(response: RebHousingPriceApiResponse): boolean {
    if ('continue2Way' in response.data) {
      return response.data.continue2Way === true;
    }
    return false;
  }

  /**
   * 공시가격 데이터 추출
   * @param response API 응답
   * @returns 공시가격 데이터
   */
  extractHousingPriceData(
    response: RebHousingPriceApiResponse
  ): RebHousingPriceEntity | null {
    if (!response.data || 'resUserAddr' in response.data) {
      return response.data as RebHousingPriceEntity;
    }
    return null;
  }

  /**
   * 특정 년도의 공시가격 필터링
   * @param response API 응답
   * @param year 년도 (YYYY)
   * @returns 필터링된 공시가격 데이터
   */
  filterByYear(
    response: RebHousingPriceApiResponse,
    year: string
  ): RebHousingPriceEntity['resPriceList'] {
    const housingPriceData = this.extractHousingPriceData(response);
    if (!housingPriceData) {
      return [];
    }

    return housingPriceData.resPriceList.filter((item) =>
      item.resReferenceDate.startsWith(year)
    );
  }

  /**
   * 공시가격 통계 정보
   * @param response API 응답
   * @returns 통계 정보
   */
  getStatistics(response: RebHousingPriceApiResponse): {
    totalCount: number;
    yearRange: { min: string; max: string };
    averagePrice: number;
  } {
    const housingPriceData = this.extractHousingPriceData(response);
    if (!housingPriceData || housingPriceData.resPriceList.length === 0) {
      return {
        totalCount: 0,
        yearRange: { min: '', max: '' },
        averagePrice: 0,
      };
    }

    const prices = housingPriceData.resPriceList
      .map((item) => parseInt(item.resBasePrice.replace(/,/g, '')))
      .filter((price) => !isNaN(price));

    const years = housingPriceData.resPriceList
      .map((item) => item.resReferenceDate.substring(0, 4))
      .filter((year) => year.length === 4);

    return {
      totalCount: housingPriceData.resPriceList.length,
      yearRange: {
        min: Math.min(...years.map((y) => parseInt(y))).toString(),
        max: Math.max(...years.map((y) => parseInt(y))).toString(),
      },
      averagePrice:
        prices.length > 0
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : 0,
    };
  }
}
