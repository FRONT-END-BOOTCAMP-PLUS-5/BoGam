export interface TaxCertCopyJson {
  // 납세증명서 복사본 JSON 구조 정의
  [key: string]: unknown;
}

export class TaxCertCopyEntity {
  constructor(
    public readonly id: number,
    public readonly userAddressId: number,
    public readonly taxCertData: string,
    public readonly updatedAt?: Date
  ) {}
}
