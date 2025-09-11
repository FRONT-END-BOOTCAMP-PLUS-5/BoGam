import { prisma } from '@utils/prisma';
import { GetUserAddressesRepository } from '@be/domain/repository/GetUserAddressesRepository';
import { UserAddressWithAddressInfo } from '@be/applications/users/dtos/UserAddressDto';

export class GetUserAddressesRepositoryImpl
  implements GetUserAddressesRepository
{
  async findUserAddressesByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo[]> {
    const userAddresses = await prisma.userAddress.findMany({
      where: { userId },
      include: {
        address: true,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return userAddresses.map((userAddress) => ({
      id: userAddress.id,
      userId: userAddress.userId,
      addressId: userAddress.addressId,
      nickname: userAddress.nickname,
      createdAt: userAddress.createdAt,
      address: {
        id: userAddress.address.id,
        latitude: userAddress.address.latitude || undefined,
        longitude: userAddress.address.longitude || undefined,
        legalDistrictCode: userAddress.address.legalDistrictCode || undefined,
        dong: userAddress.address.dong || undefined,
        ho: userAddress.address.ho || undefined,
        lotAddress: userAddress.address.lotAddress || '',
        roadAddress: userAddress.address.roadAddress || '',
      },
      isPrimary: userAddress.isPrimary,
      isSelected: userAddress.isSelected,
    }));
  }

  async findSelectedUserAddressByUserId(
    userId: string
  ): Promise<UserAddressWithAddressInfo | null> {
    try {
      const userAddress = await prisma.userAddress.findFirst({
        where: {
          userId: userId,
          isSelected: true,
        },
        include: {
          address: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!userAddress) {
        return null;
      }

      return {
        id: userAddress.id,
        addressId: userAddress.addressId,
        userId: userAddress.user.id,
        nickname: userAddress.nickname,
        isPrimary: userAddress.isPrimary,
        isSelected: userAddress.isSelected,
        createdAt: userAddress.createdAt,
        address: {
          id: userAddress.address.id,
          latitude: userAddress.address.latitude || undefined,
          longitude: userAddress.address.longitude || undefined,
          legalDistrictCode: userAddress.address.legalDistrictCode,
          dong: userAddress.address.dong || undefined,
          ho: userAddress.address.ho || undefined,
          lotAddress: userAddress.address.lotAddress,
          roadAddress: userAddress.address.roadAddress || undefined,
        },
      };
    } catch (error) {
      console.error('❌ 선택된 사용자 주소 조회 오류:', error);
      throw new Error('선택된 사용자 주소 조회 중 오류가 발생했습니다.');
    }
  }

  async updateSelectedAddress(
    userId: string,
    addressId: number
  ): Promise<boolean> {
    try {
      // 트랜잭션을 사용하여 원자적으로 처리
      await prisma.$transaction(async (tx) => {
        // 1. 해당 사용자의 모든 주소의 isSelected를 false로 설정
        await tx.userAddress.updateMany({
          where: {
            userId: userId,
          },
          data: {
            isSelected: false,
          },
        });

        // 2. 선택된 주소의 isSelected를 true로 설정
        await tx.userAddress.update({
          where: {
            id: addressId,
            userId: userId, // 보안을 위해 userId도 확인
          },
          data: {
            isSelected: true,
          },
        });
      });

      return true;
    } catch (error) {
      console.error('❌ 주소 선택 상태 업데이트 오류:', error);
      throw new Error('주소 선택 상태 업데이트 중 오류가 발생했습니다.');
    }
  }
}
