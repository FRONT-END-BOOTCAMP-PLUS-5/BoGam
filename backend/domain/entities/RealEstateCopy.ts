export interface RealEstateCopyJson {
  // 등기부등본 JSON 구조 정의
  [key: string]: unknown;
}

export class RealEstateCopyEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly realEstateData: string,
    public readonly updatedAt?: Date
  ) {}
}
