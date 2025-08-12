import { UserAddressWithAddressInfo } from './UserAddressDto';

export interface GetUserAddressesResponseDto {
  success: boolean;
  message: string;
  data?: UserAddressWithAddressInfo[];
}
