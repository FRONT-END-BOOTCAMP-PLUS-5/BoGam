import { GuaranteeLimitCopyRepository } from '@be/domain/repository/GuaranteeLimitCopyRepository';
import { encryptJson } from '@utils/encryption';
import { CreateGuaranteeLimitCopyRequestDto } from '../dtos/CreateGuaranteeLimitCopyRequestDto';
import { CreateGuaranteeLimitCopyResponseDto } from '../dtos/CreateGuaranteeLimitCopyResponseDto';

/**
 * 보증한도 복사본 생성/수정 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class CreateGuaranteeLimitCopyUsecase {
  constructor(private guaranteeLimitCopyRepository: GuaranteeLimitCopyRepository) {}

  async createGuaranteeLimitCopy(
    request: CreateGuaranteeLimitCopyRequestDto
  ): Promise<CreateGuaranteeLimitCopyResponseDto> {
    try {
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(request.guaranteeLimitJson);

      // Prisma upsert 사용
      const result = await this.guaranteeLimitCopyRepository.upsertByUserAddressId(
        request.userAddressId,
        {
          guaranteeLimitData: encryptedData,
        }
      );

      return {
        success: true,
        message: '보증한도 복사본이 성공적으로 저장되었습니다.',
        data: {
          id: result.id,
          userAddressId: result.userAddressId,
          updatedAt: result.updatedAt,
        },
      };
    } catch (error) {
      console.error('❌ 보증한도 복사본 저장 오류:', error);
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
