export interface TaxCertJson {
  // 납세증명서 JSON 구조 정의
  [key: string]: unknown;
}

export class TaxCertEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly taxCertData: string,
    public readonly updatedAt?: Date
  ) {}
}
