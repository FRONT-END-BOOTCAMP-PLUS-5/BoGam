import { UserRepository } from '@be/domain/repository/UserRepository';
import { DeleteUserRequestDto, DeleteUserResponseDto } from '@be/applications/users/dtos/DeleteUserDtos';

export class DeleteUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async deleteUser(
    deleteUserRequest: DeleteUserRequestDto
  ): Promise<DeleteUserResponseDto> {
    try {
      const { nickname } = deleteUserRequest;

      // 닉네임으로 사용자 존재 확인
      const existingUser = await this.userRepository.findByNickname(nickname);
      
      if (!existingUser) {
        return {
          success: false,
          message: '존재하지 않는 사용자입니다.'
        };
      }

      // 사용자 삭제
      await this.userRepository.deleteByNickname(nickname);

      return {
        success: true,
        message: '회원탈퇴가 완료되었습니다.',
        deletedUserNickname: nickname
      };
    } catch (error: unknown) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: '회원탈퇴 중 오류가 발생했습니다.'
      };
    }
  }
}
