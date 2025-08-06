import { UserDto } from '@be/applications/auth/dtos/LoginDtos';

export interface RegisterRequestDto {
  name?: string;
  nickname: string; // 필수 필드로 변경
  username?: string;
  password?: string;
  pinNumber?: string;
  phoneNumber?: string;
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  user?: UserDto;
}
