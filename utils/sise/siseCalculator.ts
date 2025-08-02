import { SiseEntity } from '@be/domain/entities/SiseEntity';

/**
 * 시세정보 계산 및 변환 유틸리티
 */
export class SiseCalculator {
  /**
   * 평균가 계산
   * @param lowerPrice 하한가
   * @param upperPrice 상한가
   * @returns 평균가 (만원 단위)
   */
  static calculateAveragePrice(lowerPrice: string, upperPrice: string): string {
    const avgPrice = Math.round(
      (parseInt(lowerPrice) + parseInt(upperPrice)) / 2
    );
    return `${avgPrice}만원`;
  }

  /**
   * 면적별 시세정보 요약 계산
   * @param areaPriceList 면적별 시세정보 배열
   * @returns 면적별 시세정보 요약
   */
  static calculateAreaPriceSummary(
    areaPriceList: SiseEntity['resAreaPriceList']
  ): Array<{
    area: string;
    compositionCnt: string;
    avgPrice: string;
    avgRentPrice: string;
    monthlyRent: string;
  }> {
    if (!areaPriceList || areaPriceList.length === 0) {
      return [];
    }

    return areaPriceList.map((item) => {
      const avgPrice = this.calculateAveragePrice(
        item.resLowerAveragePrice,
        item.resTopAveragePrice
      );

      const avgRentPrice = this.calculateAveragePrice(
        item.resLowerAveragePrice1,
        item.resTopAveragePrice1
      );

      return {
        area: item.resArea,
        compositionCnt: item.resCompositionCnt,
        avgPrice,
        avgRentPrice,
        monthlyRent: item.resMonthlyRent,
      };
    });
  }

  /**
   * 호별 시세정보 요약 계산
   * @param hoPriceList 호별 시세정보 배열
   * @returns 호별 시세정보 요약
   */
  static calculateHoPriceSummary(
    hoPriceList: SiseEntity['resHoPriceList']
  ): Array<{
    dong: string;
    ho: string;
    area: string;
    avgPrice: string;
    avgRentPrice: string;
    monthlyRent: string;
  }> {
    if (!hoPriceList || hoPriceList.length === 0) {
      return [];
    }

    return hoPriceList.map((item) => {
      const avgPrice = this.calculateAveragePrice(
        item.resLowestPrice,
        item.resTopPrice
      );

      const avgRentPrice = this.calculateAveragePrice(
        item.resLowestPrice1,
        item.resTopPrice1
      );

      return {
        dong: item.resDong,
        ho: item.resHo,
        area: item.resArea,
        avgPrice,
        avgRentPrice,
        monthlyRent: item.resMonthlyRent,
      };
    });
  }
}
