import { prisma } from '@utils/prisma';
import { DeleteUserAddressRepository } from '@be/domain/repository/DeleteUserAddressRepository';

export class DeleteUserAddressRepositoryImpl implements DeleteUserAddressRepository {
  async deleteUserAddress(userAddressId: number): Promise<boolean> {
    try {
      // cascade로 인해 관련된 모든 데이터가 자동으로 삭제됨
      // - stepResults
      // - realEstates
      // - taxCerts
      // - brokers
      await prisma.userAddress.delete({
        where: {
          id: userAddressId,
        },
      });

      return true;
    } catch (error) {
      console.error('DeleteUserAddressRepositoryImpl error:', error);
      return false;
    }
  }
}
