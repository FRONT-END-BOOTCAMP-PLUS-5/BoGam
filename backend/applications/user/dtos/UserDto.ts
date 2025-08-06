export interface UserInfo {
  id: string;
  nickname: string;
}

export interface GetUserInfoResponseDto {
  success: boolean;
  message: string;
  data?: UserInfo;
}
