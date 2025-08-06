import { prisma } from '@utils/prisma';
import { GetUserAddressesRepository } from '@be/domain/repository/GetUserAddressesRepository';
import { UserAddressWithAddressInfo } from '@be/applications/place/dtos/UserAddressDto';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/place/dtos/AddressDto';

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
      nickname: userAddress.nickname || undefined,
      createdAt: userAddress.createdAt,
      address: {
        id: userAddress.address.id,
        latitude: userAddress.address.latitude || undefined,
        longitude: userAddress.address.longitude || undefined,
        legalDistrictCode: userAddress.address.legalDistrictCode || undefined,
        dong: userAddress.address.dong || undefined,
        ho: userAddress.address.ho || undefined,
      },
      isPrimary: userAddress.isPrimary,
    }));
  }
}
