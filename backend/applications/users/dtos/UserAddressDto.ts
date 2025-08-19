import { AddressInfo } from './AddressDto';

export interface UserAddressInfo {
  id: number;
  userId: string;
  addressId: number;
  nickname: string;
  createdAt: Date;
  isPrimary: boolean;
  address: {
    id: number;
    latitude?: number;
    longitude?: number;
    legalDistrictCode?: string;
    dong?: string;
    ho?: string;
    lotAddress: string;
    roadAddress?: string;
  };
}

export interface UserAddressWithAddressInfo {
  id: number;
  userId: string;
  addressId: number;
  nickname: string;
  createdAt: Date;
  isPrimary: boolean;
  address: {
    id: number;
    latitude?: number;
    longitude?: number;
    legalDistrictCode?: string;
    dong?: string;
    ho?: string;
    lotAddress: string;
    roadAddress?: string;
  };
}
