import { User } from '@be/domain/entities/User';
import {
  RegisterResponseDto,
  UserDto,
} from '@be/applications/auth/dtos/LoginDtos';

export class AuthMapper {
  /**
   * User 엔티티를 UserDto로 변환합니다.
   */
  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname || '', // nickname이 없으면 빈 문자열로 설정
      username: user.username,
      phoneNumber: user.phoneNumber,
    };
  }

  /**
   * 회원가입 성공 응답을 생성합니다.
   */
  static toRegisterSuccessResponse(user: User): RegisterResponseDto {
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
