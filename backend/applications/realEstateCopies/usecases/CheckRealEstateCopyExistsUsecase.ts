import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { CheckRealEstateCopyExistsRequestDto } from '../dtos/CheckRealEstateCopyExistsRequestDto';
import { CheckRealEstateCopyExistsResponseDto } from '../dtos/CheckRealEstateCopyExistsResponseDto';

/**
 * 등기부등본 복사본 존재 확인 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class CheckRealEstateCopyExistsUsecase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async checkExists(
    request: CheckRealEstateCopyExistsRequestDto
  ): Promise<CheckRealEstateCopyExistsResponseDto> {
    try {
      const result = await this.realEstateCopyRepository.existsByUserAddressId(
        request.userAddressId
      );

      return {
        success: true,
        exists: result.exists,
        updatedAt: result.updatedAt,
        message: result.exists
          ? '등기부등본 복사본이 존재합니다.'
          : '등기부등본 복사본이 존재하지 않습니다.',
      };
    } catch (error) {
      console.error('❌ 등기부등본 복사본 존재 확인 오류:', error);
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
