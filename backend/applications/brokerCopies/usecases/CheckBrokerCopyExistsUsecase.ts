import { BrokerCopyRepository } from '@be/domain/repository/BrokerCopyRepository';
import { CheckBrokerCopyExistsRequestDto } from '../dtos/CheckBrokerCopyExistsRequestDto';
import { CheckBrokerCopyExistsResponseDto } from '../dtos/CheckBrokerCopyExistsResponseDto';

export class CheckBrokerCopyExistsUsecase {
  constructor(private brokerCopyRepository: BrokerCopyRepository) {}

  async execute(request: CheckBrokerCopyExistsRequestDto): Promise<CheckBrokerCopyExistsResponseDto> {
    try {
      const { userAddressId } = request;
      
      // 중개사 복사본 존재 여부 확인
      const result = await this.brokerCopyRepository.existsByUserAddressId(userAddressId);
      
      return {
        success: true,
        message: '중개사 복사본 존재 여부를 성공적으로 확인했습니다.',
        data: {
          exists: result.exists,
          updatedAt: result.updatedAt
        }
      };
    } catch (error) {
      console.error('CheckBrokerCopyExistsUsecase 실행 중 오류:', error);
      return {
        success: false,
        error: '중개사 복사본 존재 여부 확인 중 오류가 발생했습니다.'
      };
    }
  }
}
