import { UserRepository } from '@be/domain/repository/UserRepository';
import { RegisterRequestDto } from '@be/applications/auth/dtos/LoginDtos';
import { RegisterResponseDto } from '@be/applications/auth/dtos/LoginDtos';
import { ValidationService } from '@be/services/ValidationService';
import { PasswordService } from '@be/services/PasswordService';
import { AuthMapper } from '@be/infrastructure/mappers/AuthMapper';

export class SignUpUseCase {
  constructor(private userRepository: UserRepository) {}

  async register(
    registerRequest: RegisterRequestDto
  ): Promise<RegisterResponseDto> {
    try {
      // 입력 검증
      const validation =
        ValidationService.validateRegisterRequest(registerRequest);
      if (!validation.isValid) {
        return AuthMapper.toRegisterFailureResponse(
          validation.errors.join(', ')
        );
      }

      if (registerRequest.username) {
        const existingUser = await this.userRepository.findByUsername(
          registerRequest.username
        );
        if (existingUser) {
          return AuthMapper.toRegisterFailureResponse(
            '이미 존재하는 사용자명입니다.'
          );
        }
      }

      if (registerRequest.phoneNumber) {
        const existingUser = await this.userRepository.findByPhoneNumber(
          registerRequest.phoneNumber
        );
        if (existingUser) {
          return AuthMapper.toRegisterFailureResponse(
            '이미 존재하는 전화번호입니다.'
          );
        }
      }

      // 비밀번호 해싱
      let hashedPassword: string | undefined;
      if (registerRequest.password) {
        hashedPassword = await PasswordService.hashPassword(
          registerRequest.password
        );
      }

      let hashedPinNumber: string | undefined;
      if (registerRequest.pinNumber) {
        hashedPinNumber = await PasswordService.hashPassword(
          registerRequest.pinNumber
        );
      }

      // 새 사용자 생성
      const newUser = await this.userRepository.create({
        name: registerRequest.name,
        nickname: registerRequest.nickname,
        username: registerRequest.username,
        password: hashedPassword,
        pinNumber: hashedPinNumber,
        phoneNumber: registerRequest.phoneNumber,
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
