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
    public readonly resDong?: string
  ) {}
}

export class TransactionDetailApartEntity {
  constructor(
    public readonly resSaleList?: TransactionDetailApartSaleItem[],
    public readonly resRentList?: TransactionDetailApartRentItem[]
  ) {}
}
