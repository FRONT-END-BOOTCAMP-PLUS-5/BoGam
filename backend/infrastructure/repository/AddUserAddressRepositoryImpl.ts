import { prisma } from '@utils/prisma';
import { AddUserAddressRepository } from '@be/domain/repository/AddUserAddressRepository';
import { UserAddressInfo } from '@be/applications/place/dtos/UserAddressDto';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/place/dtos/AddressDto';

export class AddUserAddressRepositoryImpl implements AddUserAddressRepository {
  async findAddressByLocation(
    params: AddressLocationParams
  ): Promise<AddressInfo | null> {
    const address = await prisma.address.findFirst({
      where: {
        latitude: params.latitude,
        longitude: params.longitude,
        legalDistrictCode: params.legalDistrictCode,
        dong: params.dong,
        ho: params.ho,
      },
    });

    if (!address) return null;

    return {
      id: address.id,
      latitude: address.latitude || undefined,
      longitude: address.longitude || undefined,
      legalDistrictCode: address.legalDistrictCode || undefined,
      dong: address.dong || undefined,
      ho: address.ho || undefined,
    };
  }

  async createAddress(params: AddressLocationParams): Promise<AddressInfo> {
    const address = await prisma.address.create({
      data: {
        latitude: params.latitude || 0,
        longitude: params.longitude || 0,
        legalDistrictCode: params.legalDistrictCode || '',
        dong: params.dong,
        ho: params.ho,
      },
    });

    return {
      id: address.id,
      latitude: address.latitude || undefined,
      longitude: address.longitude || undefined,
      legalDistrictCode: address.legalDistrictCode || undefined,
      dong: address.dong || undefined,
      ho: address.ho || undefined,
    };
  }

  async findUserAddressByUserIdAndAddressId(
    userId: string,
    addressId: number
  ): Promise<UserAddressInfo | null> {
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
        addressId,
      },
    });

    if (!userAddress) return null;

    return {
      id: userAddress.id,
      userId: userAddress.userId,
      addressId: userAddress.addressId,
      nickname: userAddress.nickname || undefined,
      createdAt: userAddress.createdAt,
    };
  }

  async createUserAddress(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<UserAddressInfo> {
    const userAddress = await prisma.userAddress.create({
      data: {
        userId,
        addressId,
        nickname: addressNickname,
        isPrimary: false, // 기본값은 false
      },
    });

    return {
      id: userAddress.id,
      userId: userAddress.userId,
      addressId: userAddress.addressId,
      nickname: userAddress.nickname || undefined,
      createdAt: userAddress.createdAt,
    };
  }
}
