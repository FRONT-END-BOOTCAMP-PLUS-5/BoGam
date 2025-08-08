export interface TaxCertCopyJson {
  // 납세증명서 복사본 JSON 구조 정의
  [key: string]: unknown;
}

export interface TaxCertCopy {
  id: number;
  userAddressId: number;
  taxCertData: string;
  updatedAt?: Date;
}

export interface CreateTaxCertCopyDto {
  userAddressId: number;
  taxCertData: string;
}

export interface UpsertTaxCertCopyDto {
  userAddressId: number;
  taxCertData: string;
} 