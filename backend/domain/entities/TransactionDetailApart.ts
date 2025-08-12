/**
 * 실거래가 조회 결과 도메인 엔티티
 */
export interface TransactionDetailApartSaleItem {
  resYear: string;
  resMonth: string;
  resDays: string;
  resArea: string;
  resArea1?: string;
  resCancelYN?: string;
  resRegistrationDate?: string;
  resTranAmount: string;
  resFloor: string;
  resDealType?: string;
  resLocation?: string;
  resFloorNum?: string;
  resDong?: string;
}

export interface TransactionDetailApartRentItem {
  resYear: string;
  resMonth: string;
  resDays: string;
  resArea: string;
  resArea1?: string;
  resCancelYN?: string;
  resRegistrationDate?: string;
  resTranAmount: string;
  resFloor: string;
  resDealType?: string;
  resLocation?: string;
  resFloorNum?: string;
  resDong?: string;
}

export interface TransactionDetailApartEntity {
  resSaleList?: TransactionDetailApartSaleItem[];
  resRentList?: TransactionDetailApartRentItem[];
}
