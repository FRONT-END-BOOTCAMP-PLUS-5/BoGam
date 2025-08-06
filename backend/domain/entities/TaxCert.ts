export interface TaxCertJson {
  // 납세증명서 JSON 구조 정의
  [key: string]: unknown;
}

export interface TaxCert {
  id: number;
  userAddressId: number;
  taxCertData: string;
  updatedAt?: Date;
}

export interface CreateTaxCertDto {
  userAddressId: number;
  taxCertData: string;
}

export interface UpdateTaxCertDto {
  taxCertData?: string;
} 