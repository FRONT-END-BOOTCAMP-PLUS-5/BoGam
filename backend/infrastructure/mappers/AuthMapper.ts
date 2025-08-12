import { UserEntity } from '@be/domain/entities/User';
import { UserInfo } from '@be/applications/users/dtos/UserDto';
import { RegisterResponseDto } from '@be/applications/users/dtos/SignUpDtos';

export class AuthMapper {
  /**
   * User 엔티티를 UserDto로 변환합니다.
   */
  static toUserDto(user: UserEntity): UserInfo {
    return {
      id: user.id,
      nickname: user.nickname || '', // nickname이 없으면 빈 문자열로 설정
      username: user.username,
      phoneNumber: user.phoneNumber,
    };
  }

  /**
   * 회원가입 성공 응답을 생성합니다.
   */
  static toRegisterSuccessResponse(user: UserEntity): RegisterResponseDto {
    return {
      success: true,
      message: '회원가입 성공',
      user: this.toUserDto(user),
    };
  }

  /**
   * 회원가입 실패 응답을 생성합니다.
   */
  static toRegisterFailureResponse(message: string): RegisterResponseDto {
    return {
      success: false,
      message,
    };
  }
}
