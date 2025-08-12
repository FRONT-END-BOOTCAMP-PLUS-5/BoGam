import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { encryptJson } from '@utils/encryption';
import { CreateRealEstateCopyRequestDto } from '../dtos/CreateRealEstateCopyRequestDto';
import { CreateRealEstateCopyResponseDto } from '../dtos/CreateRealEstateCopyResponseDto';

/**
 * 등기부등본 복사본 생성/수정 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class CreateRealEstateCopyUsecase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async createRealEstateCopy(
    request: CreateRealEstateCopyRequestDto
  ): Promise<CreateRealEstateCopyResponseDto> {
    try {
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(request.realEstateJson);

      // Prisma upsert 사용
      const result = await this.realEstateCopyRepository.upsertByUserAddressId(
        request.userAddressId,
        {
          realEstateData: encryptedData,
        }
      );

      return {
        success: true,
        message: '등기부등본 복사본이 성공적으로 저장되었습니다.',
        data: {
          id: result.id,
          userAddressId: result.userAddressId,
          updatedAt: result.updatedAt!,
        },
      };
    } catch (error) {
      console.error('❌ 등기부등본 복사본 저장 오류:', error);
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
