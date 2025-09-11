import { prisma } from '@utils/prisma';
import { AddUserAddressRepository } from '@be/domain/repository/AddUserAddressRepository';
import { UserAddressInfo } from '@be/applications/users/dtos/UserAddressDto';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/users/dtos/AddressDto';
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
      include: {
        address: true,
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
      include: {
        address: true,
      },
    });

    if (existingUserAddress) {
      return {
        userAddress: mapUserAddressToUserAddressInfo(existingUserAddress),
        isNew: false,
      };
    }

    // 자동 생성된 닉네임 생성
    const userAddressCount = await prisma.userAddress.count({
      where: { userId },
    });
    const autoNickname = `주소_${userAddressCount + 1}`;

    // 새 사용자 주소 생성 (새로 추가된 주소를 선택된 주소로 설정)
    const userAddress = await prisma.userAddress.create({
      data: {
        userId,
        addressId,
        nickname: addressNickname || autoNickname,
        isPrimary: false,
        isSelected: true, // 새로 추가된 주소를 선택된 주소로 설정
      },
      include: {
        address: true,
      },
    });

    // 기존 선택된 주소들을 모두 false로 변경 (새 주소만 true로 유지)
    await prisma.userAddress.updateMany({
      where: {
        userId,
        id: { not: userAddress.id }, // 새로 생성된 주소 제외
      },
      data: {
        isSelected: false,
      },
    });

    // 새 사용자 주소가 생성된 경우에만 stepResult 레코드들 생성
    await prisma.stepResult.createMany({
      data: Array.from({ length: 26 }, (_, i) => ({
        userAddressId: userAddress.id,
        stepId: i + 1,
        details: {},
      })),
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
