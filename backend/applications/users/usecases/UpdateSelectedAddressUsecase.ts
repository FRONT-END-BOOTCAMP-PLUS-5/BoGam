import { GetUserAddressesRepository } from '@be/domain/repository/GetUserAddressesRepository';

export interface UpdateSelectedAddressRequestDto {
  userId: string;
  addressId: number;
}

export interface UpdateSelectedAddressResponseDto {
  success: boolean;
  message: string;
}

export class UpdateSelectedAddressUsecase {
  constructor(private getUserAddressesRepository: GetUserAddressesRepository) {}

  async execute(
    request: UpdateSelectedAddressRequestDto
  ): Promise<UpdateSelectedAddressResponseDto> {
    try {
      if (!request.userId) {
        return {
          success: false,
          message: '사용자 ID가 필요합니다.',
        };
      }

      if (!request.addressId) {
        return {
          success: false,
          message: '주소 ID가 필요합니다.',
        };
      }

      const result =
        await this.getUserAddressesRepository.updateSelectedAddress(
          request.userId,
          request.addressId
        );

      if (!result) {
        return {
          success: false,
          message: '주소 선택 상태 업데이트에 실패했습니다.',
        };
      }

      return {
        success: true,
        message: '주소 선택 상태가 성공적으로 업데이트되었습니다.',
      };
    } catch (error) {
      console.error('UpdateSelectedAddressUsecase error:', error);
      return {
        success: false,
        message: '주소 선택 상태 업데이트 중 오류가 발생했습니다.',
      };
    }
  }
}
