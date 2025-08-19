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
    }));
  }
}
