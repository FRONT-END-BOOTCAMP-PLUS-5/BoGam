// Request DTOs
export interface LoginRequestDto {
  username?: string;
  password?: string;
}

// Response DTOs
export interface UserDto {
  id: string;
  name?: string;
  nickname: string;
  username?: string;
  phoneNumber?: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  user?: UserDto;
  token?: string;
}
