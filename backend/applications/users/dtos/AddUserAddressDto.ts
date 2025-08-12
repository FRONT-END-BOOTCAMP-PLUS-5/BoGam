export interface AddUserAddressRequestDto {
  addressNickname?: string;
  latitude: number;
  longitude: number;
  legalDistrictCode: string;
  dong: string;
  ho: string;
  lotAddress: string;
}

export interface AddUserAddressResponseDto {
  success: boolean;
  message: string;
  data?: {
    userAddressId: number;
    addressId: number;
    addressNickname?: string;
  };
}
