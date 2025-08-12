import { UserAddressWithAddressInfo } from '@be/applications/users/dtos/UserAddressDto';

export interface GetUserAddressesRepository {
  findUserAddressesByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo[]>;
}
