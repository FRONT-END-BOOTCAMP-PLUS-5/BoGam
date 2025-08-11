import { TaxCertCopyRepository } from '@be/domain/repository/TaxCertCopyRepository';
import { decryptJson } from '@utils/encryption';
import { TaxCertJson } from '@be/domain/entities/TaxCert';
import { GetTaxCertCopyRequestDto } from '../dtos/GetTaxCertCopyRequestDto';
import { GetTaxCertCopyResponseDto } from '../dtos/GetTaxCertCopyResponseDto';

/**
 * 납세확인서 복사본 조회 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class GetTaxCertCopyusecase {
  constructor(private taxCertCopyRepository: TaxCertCopyRepository) {}

  async getTaxCertCopy(
    request: GetTaxCertCopyRequestDto
  ): Promise<GetTaxCertCopyResponseDto> {
    try {
      const taxCert = await this.taxCertCopyRepository.findByUserAddressId(
        request.userAddressId
      );

      if (!taxCert) {
        return {
          success: false,
          message: '납세확인서 복사본을 찾을 수 없습니다.',
        };
      }

      // 복호화 처리
      const decryptedData = {
        id: taxCert.id,
        userAddressId: taxCert.userAddressId,
        taxCertJson: decryptJson(taxCert.taxCertData) as TaxCertJson,
        updatedAt: taxCert.updatedAt!,
      };

      return {
        success: true,
        message: '납세확인서 복사본 조회가 완료되었습니다.',
        data: decryptedData,
      };
    } catch (error) {
      console.error('❌ 납세확인서 복사본 조회 오류:', error);
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
