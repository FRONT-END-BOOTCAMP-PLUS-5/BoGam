import { prisma } from '@utils/prisma';
import { AddUserAddressRepository } from '@be/domain/repository/AddUserAddressRepository';
import { UserAddressInfo } from '@be/applications/place/dtos/UserAddressDto';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/place/dtos/AddressDto';
import {
  mapAddressToAddressInfo,
  mapUserAddressToUserAddressInfo,
  createAddressWhereCondition,
  createAddressData,
} from '@be/infrastructure/mappers/AddressMapper';

export class AddUserAddressRepositoryImpl implements AddUserAddressRepository {
  async findAddressByLocation(
    params: AddressLocationParams
  ): Promise<AddressInfo | null> {
    const address = await prisma.address.findFirst({
      where: createAddressWhereCondition(params),
    });

    return address ? mapAddressToAddressInfo(address) : null;
  }

  async createAddressIfNotExists(
    params: AddressLocationParams
  ): Promise<AddressInfo> {
    // 기존 주소가 있는지 확인
    const existingAddress = await prisma.address.findFirst({
      where: createAddressWhereCondition(params),
    });

    if (existingAddress) {
      return mapAddressToAddressInfo(existingAddress);
    }

    // 새 주소 생성
    const address = await prisma.address.create({
      data: createAddressData(params),
    });

    return mapAddressToAddressInfo(address);
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

    return userAddress ? mapUserAddressToUserAddressInfo(userAddress) : null;
  }

  async createUserAddressIfNotExists(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<{ userAddress: UserAddressInfo; isNew: boolean }> {
    // 기존 사용자 주소가 있는지 확인
    const existingUserAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
        addressId,
      },
    });

    if (existingUserAddress) {
      return {
        userAddress: mapUserAddressToUserAddressInfo(existingUserAddress),
        isNew: false,
      };
    }

    // 새 사용자 주소 생성
    const userAddress = await prisma.userAddress.create({
      data: {
        userId,
        addressId,
        nickname: addressNickname,
        isPrimary: false,
      },
    });

    return {
      userAddress: mapUserAddressToUserAddressInfo(userAddress),
      isNew: true,
    };
  }

  // 기존 메서드들도 유지 (하위 호환성을 위해)
  async createAddress(params: AddressLocationParams): Promise<AddressInfo> {
    return this.createAddressIfNotExists(params);
  }

  async createUserAddress(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<UserAddressInfo> {
    const result = await this.createUserAddressIfNotExists(
      userId,
      addressId,
      addressNickname
    );
    return result.userAddress;
  }
}
