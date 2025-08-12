export interface TaxCertJson {
  // 납세증명서 JSON 구조 정의
  [key: string]: unknown;
}

export interface TaxCertEntity {
  id: number;
  userAddressId: number;
  taxCertData: string;
  updatedAt?: Date;
}
