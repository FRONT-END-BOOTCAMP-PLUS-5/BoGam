import { TogglePrimaryAddressRepository } from '@be/domain/repository/TogglePrimaryAddressRepository';
import { UserRepository } from '@be/domain/repository/UserRepository';
import {
  TogglePrimaryAddressRequestDto,
  TogglePrimaryAddressResponseDto,
} from '@be/applications/places/dtos/TogglePrimaryAddressDto';

export class TogglePrimaryAddressUsecase {
  constructor(
    private userAddressRepository: TogglePrimaryAddressRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    nickname: string,
    request: TogglePrimaryAddressRequestDto
  ): Promise<TogglePrimaryAddressResponseDto> {
    return this.updatePrimaryAddress(nickname, request);
  }

  async updatePrimaryAddress(
    nickname: string,
    request: TogglePrimaryAddressRequestDto
  ): Promise<TogglePrimaryAddressResponseDto> {
    try {
      // 1. nickname으로 userId 조회
      const user = await this.userRepository.findByNickname(nickname);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 2. 즐겨찾기 토글
      const result = await this.userAddressRepository.updatePrimaryAddress(
        user.id,
        request.userAddressId
      );

      return {
        success: true,
        message: result.isPrimary
          ? '즐겨찾기에 추가되었습니다.'
          : '즐겨찾기에서 제거되었습니다.',
        data: {
          userAddressId: result.userAddressId,
          isPrimary: result.isPrimary,
        },
      };
    } catch (error) {
      console.error('TogglePrimaryAddressUsecase error:', error);

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
        message: '즐겨찾기 토글 중 오류가 발생했습니다.',
      };
    }
  }
}
