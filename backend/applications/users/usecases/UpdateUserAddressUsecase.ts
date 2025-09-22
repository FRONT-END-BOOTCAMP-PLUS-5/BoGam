import { UpdateUserAddressRepository } from '@be/domain/repository/UpdateUserAddressRepository';
import { UserRepository } from '@be/domain/repository/UserRepository';
import {
  UpdateUserAddressRequestDto,
  UpdateUserAddressResponseDto,
} from '@be/applications/users/dtos/UpdateUserAddressDto';

export class UpdateUserAddressUsecase {
  constructor(
    private userAddressRepository: UpdateUserAddressRepository,
    private userRepository: UserRepository
  ) {}

  async updateUserAddress(
    nickname: string,
    request: UpdateUserAddressRequestDto
  ): Promise<UpdateUserAddressResponseDto> {
    try {
      // 1. nickname으로 userId 조회
      const user = await this.userRepository.findByNickname(nickname);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 2. 주소 업데이트
      const result = await this.userAddressRepository.updateUserAddress(
        user.id,
        request.userAddressId,
        {
          address: request.address,
          nickname: request.nickname,
          x: request.x,
          y: request.y,
          isPrimary: request.isPrimary,
          dong: request.dong,
          ho: request.ho,
          completeAddress: request.completeAddress,
        }
      );

      return {
        success: true,
        message: '주소가 성공적으로 수정되었습니다.',
        data: {
          userAddressId: result.userAddressId,
          updatedFields: result.updatedFields,
        },
      };
    } catch (error) {
      console.error('UpdateUserAddressUsecase error:', error);

      if (
        error instanceof Error &&
        error.message.includes('해당 주소를 찾을 수 없습니다')
      ) {
        return {
          success: false,
          message: '해당 주소를 찾을 수 없습니다.',
        };
      }

      return {
        success: false,
        message: '주소 수정 중 오류가 발생했습니다.',
      };
    }
  }
}
