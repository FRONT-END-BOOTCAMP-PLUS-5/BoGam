/**
 * 실거래가 조회 결과 도메인 엔티티
 */
export class TransactionDetailApartSaleItem {
  constructor(
    public readonly resYear: string,
    public readonly resMonth: string,
    public readonly resDays: string,
    public readonly resArea: string,
    public readonly resTranAmount: string,
    public readonly resFloor: string,
    public readonly resArea1?: string,
    public readonly resCancelYN?: string,
    public readonly resRegistrationDate?: string,
    public readonly resDealType?: string,
    public readonly resLocation?: string,
    public readonly resFloorNum?: string,
    public readonly resDong?: string
  ) {}
}

export class TransactionDetailApartRentItem {
  constructor(
    public readonly resYear: string,
    public readonly resMonth: string,
    public readonly resDays: string,
    public readonly resArea: string,
    public readonly resTranAmount: string,
    public readonly resFloor: string,
    public readonly resArea1?: string,
    public readonly resCancelYN?: string,
    public readonly resRegistrationDate?: string,
    public readonly resDealType?: string,
    public readonly resLocation?: string,
    public readonly resFloorNum?: string,
    public readonly resDong?: string,
    // 전월세 전용 필드들
    public readonly commStartDate?: string,
    public readonly commEndDate?: string,
    public readonly resDeposit?: string,
    public readonly resMonthlyRent?: string,
    public readonly resContractType?: string,
    public readonly resRenewalUse?: string,
    public readonly resPrevDeposit?: string,
    public readonly resPrevMonthlyRent?: string,
    public readonly resDesignationYN?: string,
    public readonly resRoadCondition?: string,
    public readonly resLandMoveDate?: string,
    public readonly resLandMoveReason?: string,
    public readonly resMinBLR?: string,
    public readonly resMaxBLR?: string,
    public readonly resMinFAR?: string,
    public readonly resMaxFAR?: string,
    public readonly resStructure?: string,
    public readonly resBuildYear?: string
  ) {}
}

export class TransactionDetailApartEntity {
  constructor(
    public readonly resSaleList?: TransactionDetailApartSaleItem[],
    public readonly resRentList?: TransactionDetailApartRentItem[]
  ) {}
}
