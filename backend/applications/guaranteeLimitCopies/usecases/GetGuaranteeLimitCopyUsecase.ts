import { GuaranteeLimitCopyRepository } from '@be/domain/repository/GuaranteeLimitCopyRepository';
import { decryptJson } from '@utils/encryption';
import { GuaranteeLimitCopyJson } from '../dtos/GuaranteeLimitCopyJson';
import { GetGuaranteeLimitCopyRequestDto } from '../dtos/GetGuaranteeLimitCopyRequestDto';
import { GetGuaranteeLimitCopyResponseDto } from '../dtos/GetGuaranteeLimitCopyResponseDto';

/**
 * 보증한도 복사본 조회 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class GetGuaranteeLimitCopyUsecase {
  constructor(private guaranteeLimitCopyRepository: GuaranteeLimitCopyRepository) {}

  async getGuaranteeLimitCopy(
    request: GetGuaranteeLimitCopyRequestDto
  ): Promise<GetGuaranteeLimitCopyResponseDto> {
    try {
      const guaranteeLimit = await this.guaranteeLimitCopyRepository.findByUserAddressId(
        request.userAddressId
      );

      if (!guaranteeLimit) {
        return {
          success: false,
          message: '보증한도 복사본을 찾을 수 없습니다.',
        };
      }

      // 복호화 처리
      const decryptedData = {
        id: guaranteeLimit.id,
        userAddressId: guaranteeLimit.userAddressId,
        guaranteeLimitJson: decryptJson(
          guaranteeLimit.guaranteeLimitData
        ) as GuaranteeLimitCopyJson,
        updatedAt: guaranteeLimit.updatedAt,
      };

      return {
        success: true,
        message: '보증한도 복사본 조회가 완료되었습니다.',
        data: decryptedData,
      };
    } catch (error) {
      console.error('❌ 보증한도 복사본 조회 오류:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
