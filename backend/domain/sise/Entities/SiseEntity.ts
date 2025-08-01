/**
 * 시세정보 조회 API 응답 데이터 Entity
 * CODEF API의 시세정보 조회 응답을 담는 순수한 데이터 클래스
 */
export class SiseEntity {
  constructor(
    public readonly resFixedDate: string,
    public readonly resType: string,
    public readonly resComplexName: string,
    public readonly commAddrRoadName: string,
    public readonly commAddrLotNumber: string,
    public readonly resCompositionCnt: string,
    public readonly resApprovalDate: string,
    public readonly resRealty: string,
    public readonly resImageLink: string,
    public readonly resDongCnt?: string,
    public readonly resHeatingSystem?: string,
    public readonly resFacility?: string,
    public readonly resTelNo?: string,
    public readonly resAreaPriceList?: Array<{
      resArea: string;
      resArea1?: string;
      resCompositionCnt: string;
      resFloor?: string;
      resLowerAveragePrice: string;
      resTopAveragePrice: string;
      resLowerAveragePrice1: string;
      resTopAveragePrice1: string;
      resSuretyAmt: string;
      resMonthlyRent: string;
    }>,
    public readonly resHoPriceList?: Array<{
      resDong: string;
      resHo: string;
      resArea: string;
      resTopPrice: string;
      resLowestPrice: string;
      resTopPrice1: string;
      resLowestPrice1: string;
      resCompositionCnt: string;
      resLowerAveragePrice: string;
      resTopAveragePrice: string;
      resLowerAveragePrice1: string;
      resTopAveragePrice1: string;
      resSuretyAmt: string;
      resMonthlyRent: string;
    }>
  ) {}
}
