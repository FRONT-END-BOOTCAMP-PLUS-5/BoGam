export interface TaxCertJson {
  // 납세증명서 JSON 구조 정의
  [key: string]: unknown;
}

export interface TaxCert {
  id: number;
  userAddressId: number;
  taxCertJson: TaxCertJson;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaxCertDto {
  userAddressId: number;
  taxCertJson: TaxCertJson;
}

export interface UpdateTaxCertDto {
  taxCertJson?: TaxCertJson;
} 