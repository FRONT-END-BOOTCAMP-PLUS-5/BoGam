export interface TogglePrimaryAddressRequestDto {
  userAddressId: number;
}

export interface TogglePrimaryAddressResponseDto {
  success: boolean;
  message: string;
  data?: {
    userAddressId: number;
    isPrimary: boolean;
  };
}
