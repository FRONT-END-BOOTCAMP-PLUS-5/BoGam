import { UserRepository } from '@be/domain/repository/UserRepository';
import {
  UserInfo,
  GetUserInfoResponseDto,
} from '@be/applications/users/dtos/UserDto';

export class GetUserInfoUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetUserInfoResponseDto> {
    try {
      const user = await this.userRepository.findByUserId(userId);

      if (!user) {
        return {
          success: false,
          message: '사용자 정보를 찾을 수 없습니다.',
        };
      }

      // Entity → DTO 변환
      const userInfo: UserInfo = {
        id: user.id,
        nickname: user.nickname,
        username: user.username,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        message: '사용자 정보를 성공적으로 조회했습니다.',
        data: userInfo,
      };
    } catch (error) {
      console.error('GetUserInfoUsecase error:', error);
      return {
        success: false,
        message: '사용자 정보 조회 중 오류가 발생했습니다.',
      };
    }
  }
}
