import { UserAddressWithAddressInfo } from '@be/applications/places/dtos/UserAddressDto';

export interface GetUserAddressesRepository {
  findUserAddressesByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo[]>;
}
