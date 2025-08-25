import { DeleteUserAddressRequestDto, DeleteUserAddressResponseDto } from '@be/applications/users/dtos/DeleteUserAddressDto';
import { DeleteUserAddressRepository } from '@be/domain/repository/DeleteUserAddressRepository';

export class DeleteUserAddressUsecase {
  constructor(
    private readonly deleteUserAddressRepository: DeleteUserAddressRepository
  ) {}

  async deleteUserAddress(
    userNickname: string,
    request: DeleteUserAddressRequestDto
  ): Promise<DeleteUserAddressResponseDto> {
    try {
      const { userAddressId } = request;

      // Repository를 통해 실제 삭제 실행
      const isDeleted = await this.deleteUserAddressRepository.deleteUserAddress(userAddressId);

      if (!isDeleted) {
        return {
          success: false,
          message: '사용자 주소 삭제에 실패했습니다.',
        };
      }

      return {
        success: true,
        message: '사용자 주소가 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      console.error('DeleteUserAddressUsecase error:', error);
      return {
        success: false,
        message: '사용자 주소 삭제 중 오류가 발생했습니다.',
      };
    }
  }
}
