import { GetUserAddressesRepository } from '@be/domain/repository/GetUserAddressesRepository';
import { UserAddressWithAddressInfo } from '@be/applications/users/dtos/UserAddressDto';

export interface GetSelectedUserAddressRequestDto {
  userId: string;
}

export interface GetSelectedUserAddressResponseDto {
  success: boolean;
  message: string;
  data?: UserAddressWithAddressInfo;
}

export class GetSelectedUserAddressUsecase {
  constructor(private getUserAddressesRepository: GetUserAddressesRepository) {}

  async execute(
    request: GetSelectedUserAddressRequestDto
  ): Promise<GetSelectedUserAddressResponseDto> {
    try {
      if (!request.userId) {
        return {
          success: false,
          message: '사용자 ID가 필요합니다.',
        };
      }

      const selectedUserAddress =
        await this.getUserAddressesRepository.findSelectedUserAddressByUserId(
          request.userId
        );

      if (!selectedUserAddress) {
        return {
          success: false,
          message: '선택된 주소를 찾을 수 없습니다.',
        };
      }

      return {
        success: true,
        message: '선택된 주소 정보를 성공적으로 조회했습니다.',
        data: selectedUserAddress,
      };
    } catch (error) {
      console.error('GetSelectedUserAddressUsecase error:', error);
      return {
        success: false,
        message: '선택된 주소 조회 중 오류가 발생했습니다.',
      };
    }
  }
}
