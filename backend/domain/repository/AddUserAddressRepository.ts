import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/place/dtos/AddressDto';
import { UserAddressInfo } from '@be/applications/place/dtos/UserAddressDto';

export interface AddUserAddressRepository {
  findAddressByLocation(
    params: AddressLocationParams
  ): Promise<AddressInfo | null>;
  createAddress(params: AddressLocationParams): Promise<AddressInfo>;
  findUserAddressByUserIdAndAddressId(
    userId: string,
    addressId: number
  ): Promise<UserAddressInfo | null>;
  createUserAddress(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<UserAddressInfo>;
}
