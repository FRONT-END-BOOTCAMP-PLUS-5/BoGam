import { GuaranteeLimitCopyRepository } from '@be/domain/repository/GuaranteeLimitCopyRepository';
import { CheckGuaranteeLimitCopyExistsRequestDto } from '../dtos/CheckGuaranteeLimitCopyExistsRequestDto';
import { CheckGuaranteeLimitCopyExistsResponseDto } from '../dtos/CheckGuaranteeLimitCopyExistsResponseDto';

/**
 * 보증한도 복사본 존재 확인 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class CheckGuaranteeLimitCopyExistsUsecase {
  constructor(private guaranteeLimitCopyRepository: GuaranteeLimitCopyRepository) {}

  async checkExists(
    request: CheckGuaranteeLimitCopyExistsRequestDto
  ): Promise<CheckGuaranteeLimitCopyExistsResponseDto> {
    try {
      const result = await this.guaranteeLimitCopyRepository.existsByUserAddressId(
        request.userAddressId
      );

      return {
        success: true,
        exists: result.exists,
        updatedAt: result.updatedAt,
        message: result.exists
          ? '보증한도 복사본이 존재합니다.'
          : '보증한도 복사본이 존재하지 않습니다.',
      };
    } catch (error) {
      console.error('❌ 보증한도 복사본 존재 확인 오류:', error);
      return {
        success: false,
        exists: false,
        error:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }
}
