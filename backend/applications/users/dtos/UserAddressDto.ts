import { AddressInfo } from './AddressDto';

export interface UserAddressInfo {
  id: number;
  userId: string;
  addressId: number;
  nickname?: string;
  createdAt: Date;
}

export interface UserAddressWithAddressInfo {
  id: number;
  userId: string;
  addressId: number;
  nickname?: string;
  createdAt: Date;
  address: AddressInfo;
  isPrimary: boolean;
}
