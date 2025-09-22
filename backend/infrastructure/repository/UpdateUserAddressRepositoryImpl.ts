import { prisma } from '@utils/prisma';
import { UpdateUserAddressRepository } from '@be/domain/repository/UpdateUserAddressRepository';

export class UpdateUserAddressRepositoryImpl
  implements UpdateUserAddressRepository
{
  async updateUserAddress(
    userId: string,
    userAddressId: number,
    updateData: {
      address?: string;
      nickname?: string;
      x?: number;
      y?: number;
      isPrimary?: boolean;
      dong?: string;
      ho?: string;
      completeAddress?: string;
    }
  ): Promise<{ userAddressId: number; updatedFields: string[] }> {
    // 해당 사용자의 userAddress가 존재하는지 확인
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        id: userAddressId,
        userId,
      },
    });

    if (!userAddress) {
      throw new Error('해당 주소를 찾을 수 없습니다.');
    }

    // 업데이트할 필드들만 추출
    const updateFields: {
      nickname?: string;
      x?: number;
      y?: number;
      isPrimary?: boolean;
    } = {};
    const updatedFields: string[] = [];

    if (updateData.nickname !== undefined) {
      updateFields.nickname = updateData.nickname;
      updatedFields.push('nickname');
    }
    if (updateData.x !== undefined) {
      updateFields.x = updateData.x;
      updatedFields.push('x');
    }
    if (updateData.y !== undefined) {
      updateFields.y = updateData.y;
      updatedFields.push('y');
    }
    if (updateData.isPrimary !== undefined) {
      updateFields.isPrimary = updateData.isPrimary;
      updatedFields.push('isPrimary');
    }

    // 주소 테이블도 업데이트 (dong, ho, completeAddress)
    if (
      updateData.dong !== undefined ||
      updateData.ho !== undefined ||
      updateData.completeAddress !== undefined
    ) {
      const addressUpdateFields: {
        dong?: string;
        ho?: string;
        completeAddress?: string;
      } = {};

      if (updateData.dong !== undefined) {
        addressUpdateFields.dong = updateData.dong;
        updatedFields.push('dong');
      }
      if (updateData.ho !== undefined) {
        addressUpdateFields.ho = updateData.ho;
        updatedFields.push('ho');
      }
      if (updateData.completeAddress !== undefined) {
        // completeAddress는 별도 필드가 아니라 계산된 값이므로
        // 실제로는 lotAddress나 roadAddress를 업데이트해야 할 수도 있음
        updatedFields.push('completeAddress');
      }

      // address 테이블 업데이트
      if (Object.keys(addressUpdateFields).length > 0) {
        await prisma.address.update({
          where: { id: userAddress.addressId },
          data: addressUpdateFields,
        });
      }
    }

    // userAddress 테이블 업데이트
    if (Object.keys(updateFields).length > 0) {
      await prisma.userAddress.update({
        where: {
          id: userAddressId,
        },
        data: updateFields,
      });
    }

    return {
      userAddressId,
      updatedFields,
    };
  }
}
