import { UserRepository } from '@be/domain/repository/UserRepository';
import { RegisterRequestDto } from '@be/applications/user/dtos/SignUpDtos';
import { RegisterResponseDto } from '@be/applications/user/dtos/SignUpDtos';
import { ValidationService } from '@be/services/ValidationService';
import { PasswordService } from '@be/services/PasswordService';
import { AuthMapper } from '@be/infrastructure/mappers/AuthMapper';

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async signUp(
    signUpRequest: RegisterRequestDto
  ): Promise<RegisterResponseDto> {
    try {
      // 입력 검증
      const validation =
        ValidationService.validateRegisterRequest(signUpRequest);
      if (!validation.isValid) {
        return AuthMapper.toRegisterFailureResponse(
          validation.errors.join(', ')
        );
      }

      // 비밀번호 해싱
      let hashedPassword: string | undefined;
      if (signUpRequest.password) {
        hashedPassword = await PasswordService.hashPassword(
          signUpRequest.password
        );
      }

      let hashedPinNumber: string | undefined;
      if (signUpRequest.pinNumber) {
        hashedPinNumber = await PasswordService.hashPassword(
          signUpRequest.pinNumber
        );
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
