import { GetUserAddressesRepository } from '@be/domain/repository/GetUserAddressesRepository';
import { UserRepository } from '@be/domain/repository/UserRepository';
import { GetUserAddressesResponseDto } from '@be/applications/place/dtos/GetUserAddressesDto';

export class GetUserAddressesUseCase {
  constructor(
    private userAddressRepository: GetUserAddressesRepository,
    private userRepository: UserRepository
  ) {}

  async execute(nickname: string): Promise<GetUserAddressesResponseDto> {
    try {
      // 1. nickname으로 userId 조회
      const user = await this.userRepository.findByNickname(nickname);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 2. 사용자의 주소 목록 조회
      const userAddresses =
        await this.userAddressRepository.findUserAddressesByUserId(user.id);

      return {
        success: true,
        message: '주소 목록을 성공적으로 조회했습니다.',
        data: userAddresses,
      };
    } catch (error) {
      console.error('GetUserAddressesUseCase error:', error);
      return {
        success: false,
        message: '주소 목록 조회 중 오류가 발생했습니다.',
      };
    }
  }
}
