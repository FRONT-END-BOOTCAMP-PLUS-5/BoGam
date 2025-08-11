import { UserRepository } from '@be/domain/repository/UserRepository';
import { RegisterRequestDto } from '@be/applications/users/dtos/SignUpDtos';
import { RegisterResponseDto } from '@be/applications/users/dtos/SignUpDtos';
import { hashPassword } from '@utils/verifyPassword/password';
import { AuthMapper } from '@be/infrastructure/mappers/AuthMapper';

export class SignUpusecase {
  constructor(private userRepository: UserRepository) {}

  async signUp(
    signUpRequest: RegisterRequestDto
  ): Promise<RegisterResponseDto> {
    try {
      const errors: string[] = [];

      if (!signUpRequest.name) {
        errors.push('이름은 필수입니다.');
      }

      if (!signUpRequest.nickname) {
        errors.push('닉네임은 필수입니다.');
      }

      if (!signUpRequest.username) {
        errors.push('사용자명은 필수입니다.');
      }

      if (!signUpRequest.password && !signUpRequest.pinNumber) {
        errors.push('비밀번호 또는 PIN 번호 중 하나는 필수입니다.');
      }

      if (!signUpRequest.phoneNumber) {
        errors.push('전화번호는 필수입니다.');
      }

      // 비밀번호 해싱
      let hashedPassword: string | undefined;
      if (signUpRequest.password) {
        hashedPassword = await hashPassword(signUpRequest.password);
      }

      let hashedPinNumber: string | undefined;
      if (signUpRequest.pinNumber) {
        hashedPinNumber = await hashPassword(signUpRequest.pinNumber);
      }

      // 새 사용자 생성
      const newUser = await this.userRepository.create({
        name: signUpRequest.name,
        nickname: signUpRequest.nickname,
        username: signUpRequest.username,
        password: hashedPassword,
        pinNumber: hashedPinNumber,
        phoneNumber: signUpRequest.phoneNumber,
      });

      return AuthMapper.toRegisterSuccessResponse(newUser);
    } catch (error: unknown) {
      console.error('Register error:', error);
      return AuthMapper.toRegisterFailureResponse(
        '회원가입 중 오류가 발생했습니다.'
      );
    }
  }
}
