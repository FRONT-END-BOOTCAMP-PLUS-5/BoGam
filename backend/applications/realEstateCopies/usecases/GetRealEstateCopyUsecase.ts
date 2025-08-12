import { RealEstateCopyRepository } from '@be/domain/repository/RealEstateCopyRepository';
import { decryptJson } from '@utils/encryption';
import { RealEstateCopyJson } from '@be/domain/entities/RealEstateCopy';
import { GetRealEstateCopyRequestDto } from '../dtos/GetRealEstateCopyRequestDto';
import { GetRealEstateCopyResponseDto } from '../dtos/GetRealEstateCopyResponseDto';

/**
 * 등기부등본 복사본 조회 Usecase
 * 클린 아키텍처의 Application 레이어
 */
export class GetRealEstateCopyusecase {
  constructor(private realEstateCopyRepository: RealEstateCopyRepository) {}

  async getRealEstateCopy(
    request: GetRealEstateCopyRequestDto
  ): Promise<GetRealEstateCopyResponseDto> {
    try {
      const realEstate =
        await this.realEstateCopyRepository.findByUserAddressId(
          request.userAddressId
        );

      if (!realEstate) {
        return {
          success: false,
          message: '등기부등본 복사본을 찾을 수 없습니다.',
        };
      }

      // 복호화 처리
      const decryptedData = {
        id: realEstate.id,
        userAddressId: realEstate.userAddressId,
        realEstateJson: decryptJson(
          realEstate.realEstateData
        ) as RealEstateCopyJson,
        updatedAt: realEstate.updatedAt!,
      };

      return {
        success: true,
        message: '등기부등본 복사본 조회가 완료되었습니다.',
        data: decryptedData,
      };
    } catch (error) {
      console.error('❌ 등기부등본 복사본 조회 오류:', error);
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
