import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { encryptJson } from '@utils/encryption';
import { CreateTaxCertCopyRequestDto } from '../dtos/CreateTaxCertCopyRequestDto';
import { CreateTaxCertCopyResponseDto } from '../dtos/CreateTaxCertCopyResponseDto';

/**
 * 납세확인서 복사본 생성/수정 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class CreateTaxCertCopyUsecase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async createTaxCertCopy(
    request: CreateTaxCertCopyRequestDto
  ): Promise<CreateTaxCertCopyResponseDto> {
    try {
      // JSON을 암호화된 문자열로 변환
      const encryptedData = encryptJson(request.taxCertJson);

      // Prisma upsert 사용
      const result = await this.taxCertCopyRepository.upsertByUserAddressId(
        request.userAddressId,
        {
          taxCertData: encryptedData,
        }
      );

      return {
        success: true,
        message: '납세확인서 복사본이 성공적으로 저장되었습니다.',
        data: {
          id: result.id,
          userAddressId: result.userAddressId,
          updatedAt: result.updatedAt!,
        },
      };
    } catch (error) {
      console.error('❌ 납세확인서 복사본 저장 오류:', error);
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
