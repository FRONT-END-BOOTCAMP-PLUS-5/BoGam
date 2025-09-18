export interface UpdateUserAddressRequestDto {
  userAddressId: number;
  address?: string;
  nickname?: string;
  x?: number;
  y?: number;
  isPrimary?: boolean;
  dong?: string;
  ho?: string;
  completeAddress?: string;
}

export interface UpdateUserAddressResponseDto {
  success: boolean;
  message: string;
  data?: {
    userAddressId: number;
    updatedFields: string[];
  };
}
