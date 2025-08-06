import { prisma } from '@utils/prisma';
import { TogglePrimaryAddressRepository } from '@be/domain/repository/TogglePrimaryAddressRepository';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/place/dtos/AddressDto';

export class TogglePrimaryAddressRepositoryImpl
  implements TogglePrimaryAddressRepository
{
  async updatePrimaryAddress(
    userId: string,
    userAddressId: number
  ): Promise<{ userAddressId: number; isPrimary: boolean }> {
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

    // 현재 상태를 반전
    const newIsPrimary = !userAddress.isPrimary;

    // 업데이트
    const updatedUserAddress = await prisma.userAddress.update({
      where: {
        id: userAddressId,
      },
      data: {
        isPrimary: newIsPrimary,
      },
    });

    return {
      userAddressId: updatedUserAddress.id,
      isPrimary: updatedUserAddress.isPrimary,
    };
  }
}
