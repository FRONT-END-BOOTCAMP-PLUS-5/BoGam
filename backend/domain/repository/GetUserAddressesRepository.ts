import { UserAddressWithAddressInfo } from '@be/applications/place/dtos/UserAddressDto';

export interface GetUserAddressesRepository {
  findUserAddressesByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo[]>;
}
