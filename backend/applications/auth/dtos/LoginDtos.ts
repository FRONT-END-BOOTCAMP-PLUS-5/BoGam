// Request DTOs
export interface LoginRequestDto {
  username?: string;
  password?: string;
}

export interface RegisterRequestDto {
  name?: string;
  nickname: string; // 필수 필드로 변경
  username?: string;
  password?: string;
  pinNumber?: string;
  phoneNumber?: string;
}

// Response DTOs
export interface UserDto {
  id: string;
  name?: string;
  nickname: string; // 필수 필드로 변경
  username?: string;
  phoneNumber?: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  user?: UserDto;
  token?: string;
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  user?: UserDto;
}

// Token DTOs
export interface TokenVerifyRequestDto {
  token: string;
}

export interface TokenVerifyResponseDto {
  success: boolean;
  message: string;
  user?: UserDto;
}
