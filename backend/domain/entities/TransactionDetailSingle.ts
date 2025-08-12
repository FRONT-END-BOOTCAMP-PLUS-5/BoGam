/**
 * 단독/다가구 실거래가 조회 도메인 엔티티
 */
export class TransactionDetailSingleSaleItem {
  constructor(
    public readonly resYear: string,
    public readonly resMonth: string,
    public readonly resDays: string,
    public readonly resAddrDong: string,
    public readonly resStreetNumber: string,
    public readonly resRoadName: string,
    public readonly resArea: string,
    public readonly resArea1: string,
    public readonly resTranAmount: string,
    public readonly resDealType: string,
    public readonly resRoadCondition: string,
    public readonly resLandMoveDate: string,
    public readonly resLandMoveReason: string,
    public readonly resBuildYear: string,
    public readonly resHouseType: string,
    public readonly resCancelDate?: string,
    public readonly resLocation?: string,
    public readonly resDesignationYN?: string,
    public readonly resMinBLR?: string,
    public readonly resMaxBLR?: string,
    public readonly resMinFAR?: string,
    public readonly resMaxFAR?: string,
    public readonly resFloorNum?: string,
    public readonly resStructure?: string
  ) {}
}

export class TransactionDetailSingleRentItem {
  constructor(
    public readonly resYear: string,
    public readonly resMonth: string,
    public readonly resDays: string,
    public readonly resAddrDong: string,
    public readonly resStreetNumber: string,
    public readonly resHouseType: string,
    public readonly resArea: string,
    public readonly resDeposit: string,
    public readonly resMonthlyRent: string,
    public readonly resRoadCondition: string,
    public readonly resLandMoveDate: string,
    public readonly resLandMoveReason: string,
    public readonly resBuildYear: string,
    public readonly resRoadName?: string,
    public readonly commStartDate?: string,
    public readonly commEndDate?: string,
    public readonly resContractType?: string,
    public readonly resRenewalUse?: string,
    public readonly resPrevDeposit?: string,
    public readonly resPrevMonthlyRent?: string,
    public readonly resDesignationYN?: string,
    public readonly resMinBLR?: string,
    public readonly resMaxBLR?: string,
    public readonly resMinFAR?: string,
    public readonly resMaxFAR?: string,
    public readonly resFloorNum?: string,
    public readonly resStructure?: string
  ) {}
}

export class TransactionDetailSingleEntity {
  constructor(
    public readonly resSaleList?: TransactionDetailSingleSaleItem[],
    public readonly resRentList?: TransactionDetailSingleRentItem[]
  ) {}
}
