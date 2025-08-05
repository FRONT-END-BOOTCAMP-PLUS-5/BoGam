export interface RegistryCopyJson {
  // 등기부등본 JSON 구조 정의
  [key: string]: unknown;
}

export interface RegistryCopy {
  id: number;
  userAddressId: number;
  realEstateJson: RegistryCopyJson;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRegistryCopyDto {
  userAddressId: number;
  realEstateJson: RegistryCopyJson;
}

export interface UpdateRegistryCopyDto {
  realEstateJson?: RegistryCopyJson;
} 