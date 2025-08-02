import { HousingPriceRepository } from '@be/infrastructure/repository/HousingPriceRepository';
import { HousingPriceEntity } from '@be/domain/entities/HousingPriceEntity';
import {
  HousingPriceRequest,
  HousingPriceApiResponse,
} from '../dtos/HousingPriceDto';

/**
 * 부동산 공시가격 알리미 개별주택 가격 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class HousingPriceUseCase {
  private readonly repository: HousingPriceRepository;

  constructor(repository: HousingPriceRepository) {
    this.repository = repository;
  }

  /**
   * 부동산 공시가격 알리미 개별주택 가격 조회
   * @param request 부동산 공시가격 조회 요청 데이터
   * @returns 부동산 공시가격 조회 응답 데이터
   */
  async getHousingPrice(
    request: HousingPriceRequest
  ): Promise<HousingPriceApiResponse> {
    // Repository를 통해 API 호출
    return this.repository.getHousingPrice(request);
  }

  /**
   * 공시가격 데이터 추출
   * @param response API 응답
   * @returns 공시가격 데이터 배열
   */
  extractHousingPriceList(
    response: HousingPriceApiResponse
  ): HousingPriceEntity['resHousingPriceList'] {
    if (!response.data || !response.data.resHousingPriceList) {
      return [];
    }
    return response.data.resHousingPriceList;
  }

  /**
   * 특정 년도의 공시가격 필터링
   * @param response API 응답
   * @param year 년도 (YYYY)
   * @returns 필터링된 공시가격 데이터
   */
  filterByYear(
    response: HousingPriceApiResponse,
    year: string
  ): HousingPriceEntity['resHousingPriceList'] {
    const housingPriceList = this.extractHousingPriceList(response);
    return housingPriceList.filter((item) =>
      item.resReferenceDate.startsWith(year)
    );
  }

  /**
   * 공시가격 통계 정보
   * @param response API 응답
   * @returns 통계 정보
   */
  getStatistics(response: HousingPriceApiResponse): {
    totalCount: number;
    yearRange: { min: string; max: string };
    averagePrice: number;
  } {
    const housingPriceList = this.extractHousingPriceList(response);

    if (housingPriceList.length === 0) {
      return {
        totalCount: 0,
        yearRange: { min: '', max: '' },
        averagePrice: 0,
      };
    }

    const prices = housingPriceList
      .map((item) => parseInt(item.resBasePrice.replace(/,/g, '')))
      .filter((price) => !isNaN(price));

    const years = housingPriceList
      .map((item) => item.resReferenceDate.substring(0, 4))
      .filter((year) => year.length === 4);

    return {
      totalCount: housingPriceList.length,
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
