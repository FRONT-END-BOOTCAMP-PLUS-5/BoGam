import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/places/dtos/AddressDto';
import { UserAddressInfo } from '@be/applications/places/dtos/UserAddressDto';

export interface AddUserAddressRepository {
  findAddressByLocation(
    params: AddressLocationParams
  ): Promise<AddressInfo | null>;
  createAddress(params: AddressLocationParams): Promise<AddressInfo>;
  createAddressIfNotExists(params: AddressLocationParams): Promise<AddressInfo>;
  findUserAddressByUserIdAndAddressId(
    userId: string,
    addressId: number
  ): Promise<UserAddressInfo | null>;
  createUserAddress(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<UserAddressInfo>;
  createUserAddressIfNotExists(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<{ userAddress: UserAddressInfo; isNew: boolean }>;
}
