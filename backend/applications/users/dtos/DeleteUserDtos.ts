// Request DTOs
export interface DeleteUserRequestDto {
  nickname: string; // JWT에서 가져온 닉네임
}

// Response DTOs
export interface DeleteUserResponseDto {
  success: boolean;
  message: string;
  deletedUserNickname?: string;
}
