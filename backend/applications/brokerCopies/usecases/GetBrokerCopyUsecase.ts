import { BrokerCopyRepository } from '@be/domain/repository/BrokerCopyRepository';
import { GetBrokerCopyRequestDto } from '../dtos/GetBrokerCopyRequestDto';
import { GetBrokerCopyResponseDto } from '../dtos/GetBrokerCopyResponseDto';
import { decryptJson } from '@utils/encryption';
import { BrokerApiResponse } from '@be/domain/entities/Broker';

export class GetBrokerCopyUsecase {
  constructor(private brokerCopyRepository: BrokerCopyRepository) {}

  async execute(request: GetBrokerCopyRequestDto): Promise<GetBrokerCopyResponseDto> {
    try {
      const { userAddressId } = request;
      
      // 중개사 복사본 조회
      const brokerCopy = await this.brokerCopyRepository.findByUserAddressId(userAddressId);
      
      if (!brokerCopy) {
        return {
          success: false,
          error: '중개사 복사본을 찾을 수 없습니다.'
        };
      }

      return {
        success: true,
        message: '중개사 복사본을 성공적으로 조회했습니다.',
        data: {
          id: brokerCopy.id,
          userAddressId: brokerCopy.userAddressId,
          brokerData: decryptJson(brokerCopy.brokerData) as BrokerApiResponse,
          updatedAt: brokerCopy.updatedAt || new Date()
        }
      };
    } catch (error) {
      console.error('GetBrokerCopyUsecase 실행 중 오류:', error);
      return {
        success: false,
        error: '중개사 복사본 조회 중 오류가 발생했습니다.'
      };
    }
  }
}
