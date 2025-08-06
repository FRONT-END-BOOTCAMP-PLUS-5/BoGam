export interface RealEstateCopyJson {
  // 등기부등본 JSON 구조 정의
  [key: string]: unknown;
}

export interface RealEstateCopy {
  id: number;
  userAddressId: number;
  realEstateData: string;
  updatedAt?: Date;
}

export interface CreateRealEstateCopyDto {
  userAddressId: number;
  realEstateData: string;
}

export interface UpdateRealEstateCopyDto {
  realEstateData?: string;
}