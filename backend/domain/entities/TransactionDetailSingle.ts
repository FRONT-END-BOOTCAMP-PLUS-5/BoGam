/**
 * 단독/다가구 실거래가 조회 도메인 엔티티
 */
export interface TransactionDetailSingleSaleItem {
  resYear: string;
  resMonth: string;
  resDays: string;
  resAddrDong: string;
  resStreetNumber: string;
  resRoadName: string;
  resArea: string;
  resArea1: string;
  resCancelDate?: string;
  resTranAmount: string;
  resDealType: string;
  resLocation?: string;
  resDesignationYN?: string;
  resRoadCondition: string;
  resLandMoveDate: string;
  resLandMoveReason: string;
  resMinBLR?: string;
  resMaxBLR?: string;
  resMinFAR?: string;
  resMaxFAR?: string;
  resFloorNum?: string;
  resStructure?: string;
  resBuildYear: string;
  resHouseType: string;
}

export interface TransactionDetailSingleRentItem {
  resYear: string;
  resMonth: string;
  resDays: string;
  resAddrDong: string;
  resStreetNumber: string;
  resRoadName?: string;
  resHouseType: string;
  resArea: string;
  commStartDate?: string;
  commEndDate?: string;
  resDeposit: string;
  resMonthlyRent: string;
  resContractType?: string;
  resRenewalUse?: string;
  resPrevDeposit?: string;
  resPrevMonthlyRent?: string;
  resDesignationYN?: string;
  resRoadCondition: string;
  resLandMoveDate: string;
  resLandMoveReason: string;
  resMinBLR?: string;
  resMaxBLR?: string;
  resMinFAR?: string;
  resMaxFAR?: string;
  resFloorNum?: string;
  resStructure?: string;
  resBuildYear: string;
}

export interface TransactionDetailSingleEntity {
  resSaleList?: TransactionDetailSingleSaleItem[];
  resRentList?: TransactionDetailSingleRentItem[];
}
