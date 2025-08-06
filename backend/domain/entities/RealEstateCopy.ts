export interface RealEstateCopyJson {
  // 등기부등본 JSON 구조 정의
  [key: string]: unknown;
}

export interface RealEstateCopy {
  id: number;
  userAddressId: number;
  realEstateJson: RealEstateCopyJson;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRealEstateCopyDto {
  userAddressId: number;
  realEstateJson: RealEstateCopyJson;
}

export interface UpdateRealEstateCopyDto {
  realEstateJson?: RealEstateCopyJson;
}