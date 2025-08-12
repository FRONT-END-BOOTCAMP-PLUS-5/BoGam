export interface RealEstateCopyJson {
  // 등기부등본 JSON 구조 정의
  [key: string]: unknown;
}

export interface RealEstateCopyEntity {
  id: number;
  userAddressId: number;
  realEstateData: string;
  updatedAt?: Date;
}
