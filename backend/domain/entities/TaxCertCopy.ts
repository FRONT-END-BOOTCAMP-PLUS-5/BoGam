export interface TaxCertCopyJson {
  // 납세증명서 복사본 JSON 구조 정의
  [key: string]: unknown;
}

export interface TaxCertCopyEntity {
  id: number;
  userAddressId: number;
  taxCertData: string;
  updatedAt?: Date;
}
