import { UserRepository } from '@be/domain/repository/UserRepository';
import { GetUserInfoResponseDto } from '@be/applications/user/dtos/UserDto';

export class GetUserInfoUseCase {
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

      return {
        success: true,
        message: '사용자 정보를 성공적으로 조회했습니다.',
        data: user,
      };
    } catch (error) {
      console.error('GetUserInfoUseCase error:', error);
      return {
        success: false,
        message: '사용자 정보 조회 중 오류가 발생했습니다.',
      };
    }
  }
}
