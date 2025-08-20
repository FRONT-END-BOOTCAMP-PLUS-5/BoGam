import { BrokerCopyRepository } from '@be/domain/repository/BrokerCopyRepository';
import { CreateBrokerCopyRequestDto } from '../dtos/CreateBrokerCopyRequestDto';
import { CreateBrokerCopyResponseDto } from '../dtos/CreateBrokerCopyResponseDto';
import { encryptJson } from '@utils/encryption';

export class CreateBrokerCopyUsecase {
  constructor(private brokerCopyRepository: BrokerCopyRepository) {}

  async execute(request: CreateBrokerCopyRequestDto): Promise<CreateBrokerCopyResponseDto> {
    try {
      const { userAddressId, brokerJson } = request;
      
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(brokerJson);
      
      // 중개사 복사본 생성/수정
      const brokerCopy = await this.brokerCopyRepository.upsertByUserAddressId(
        userAddressId,
        { brokerData: encryptedData }
      );

      // 저장 성공 여부 확인
      if (!brokerCopy || !brokerCopy.id) {
        return {
          success: false,
          error: '중개사 복사본 저장에 실패했습니다.'
        };
      }

      return {
        success: true,
        message: '중개사 복사본이 성공적으로 저장되었습니다.',
        data: {
          id: brokerCopy.id,
          userAddressId: userAddressId,
          updatedAt: brokerCopy.updatedAt || new Date()
        }
      };
    } catch (error) {
      console.error('CreateBrokerCopyUsecase 실행 중 오류:', error);
      return {
        success: false,
        error: '중개사 복사본 저장 중 오류가 발생했습니다.'
      };
    }
  }
}
