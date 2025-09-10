import { UserAddressWithAddressInfo } from '@be/applications/users/dtos/UserAddressDto';

export interface GetUserAddressesRepository {
  findUserAddressesByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo[]>;
  findSelectedUserAddressByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo | null>;
  updateSelectedAddress(userId: string, addressId: number): Promise<boolean>;
}
