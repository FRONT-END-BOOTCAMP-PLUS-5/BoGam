import { PrismaClient } from '@prisma/client';
import { TransactionSearchRepository } from '@be/domain/repository/TransactionSearchRepository';
import { TransactionSearch } from '@be/domain/entities/TransactionSearch';
import { encrypt, decrypt } from '@utils/encryption';

export class TransactionSearchRepositoryImpl implements TransactionSearchRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserAddressId(userAddressId: number): Promise<TransactionSearch | null> {
    try {
      const result = await this.prisma.transactionSearch.findUnique({
        where: { userAddressId },
      });

      if (!result) {
        return null;
      }

      return {
        id: result.id,
        userAddressId: result.userAddressId,
        transactionSearchData: result.transactionSearchData, // 이미 암호화된 상태
        updatedAt: result.updatedAt,
      };
    } catch (error) {
      console.error('TransactionSearch 조회 오류:', error);
      throw new Error('TransactionSearch 조회 중 오류가 발생했습니다.');
    }
  }

  async upsert(transactionSearch: Omit<TransactionSearch, 'id' | 'updatedAt'>): Promise<TransactionSearch> {
    try {
      // 데이터를 JSON으로 직렬화 후 암호화
      const jsonData = JSON.stringify(transactionSearch.transactionSearchData);
      const encryptedData = encrypt(jsonData);

      const result = await this.prisma.transactionSearch.upsert({
        where: { userAddressId: transactionSearch.userAddressId },
        update: {
          transactionSearchData: encryptedData,
        },
        create: {
          userAddressId: transactionSearch.userAddressId,
          transactionSearchData: encryptedData,
        },
      });

      return {
        id: result.id,
        userAddressId: result.userAddressId,
        transactionSearchData: result.transactionSearchData,
        updatedAt: result.updatedAt,
      };
    } catch (error) {
      console.error('TransactionSearch 저장/수정 오류:', error);
      throw new Error('TransactionSearch 저장/수정 중 오류가 발생했습니다.');
    }
  }

  async exists(userAddressId: number): Promise<boolean> {
    try {
      const count = await this.prisma.transactionSearch.count({
        where: { userAddressId },
      });
      return count > 0;
    } catch (error) {
      console.error('TransactionSearch 존재 여부 확인 오류:', error);
      throw new Error('TransactionSearch 존재 여부 확인 중 오류가 발생했습니다.');
    }
  }
}
