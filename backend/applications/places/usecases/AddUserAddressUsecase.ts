import { AddUserAddressRepository } from '@be/domain/repository/AddUserAddressRepository';
import { UserRepository } from '@be/domain/repository/UserRepository';
import {
  AddUserAddressRequestDto,
  AddUserAddressResponseDto,
} from '@be/applications/places/dtos/AddUserAddressDto';

export class AddUserAddressUsecase {
  constructor(
    private userAddressRepository: AddUserAddressRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    nickname: string,
    request: AddUserAddressRequestDto
  ): Promise<AddUserAddressResponseDto> {
    try {
      // 1. nickname으로 userId 조회
      const user = await this.userRepository.findByNickname(nickname);
      if (!user) {
        return {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        };
      }

      // 2. 주소가 이미 존재하는지 확인
      const existingAddress =
        await this.userAddressRepository.findAddressByLocation({
          latitude: request.latitude,
          longitude: request.longitude,
          legalDistrictCode: request.legalDistrictCode,
          dong: request.dong,
          ho: request.ho,
        });

      let addressId: number;

      if (existingAddress) {
        // 3. 기존 주소가 있으면 해당 주소 ID 사용
        addressId = existingAddress.id;
      } else {
        // 4. 기존 주소가 없으면 새로 생성
        const newAddress = await this.userAddressRepository.createAddress({
          latitude: request.latitude,
          longitude: request.longitude,
          legalDistrictCode: request.legalDistrictCode,
          dong: request.dong,
          ho: request.ho,
        });
        addressId = newAddress.id;
      }

      // 5. 사용자가 이미 이 주소를 가지고 있는지 확인
      const existingUserAddress =
        await this.userAddressRepository.findUserAddressByUserIdAndAddressId(
          user.id,
          addressId
        );

      if (existingUserAddress) {
        // 중복일 때는 조용히 실패 처리 (로그 데이터처럼)
        return {
          success: false,
          message: '주소 추가에 실패했습니다.',
        };
      }

      // 6. user_addresses 테이블에 추가
      const userAddress = await this.userAddressRepository.createUserAddress(
        user.id,
        addressId,
        request.addressNickname
      );

      return {
        success: true,
        message: '주소가 성공적으로 추가되었습니다.',
        data: {
          userAddressId: userAddress.id,
          addressId: userAddress.addressId,
          addressNickname: userAddress.nickname,
        },
      };
    } catch (error) {
      console.error('AddUserAddressUsecase error:', error);
      return {
        success: false,
        message: '주소 추가 중 오류가 발생했습니다.',
      };
    }
  }
}
