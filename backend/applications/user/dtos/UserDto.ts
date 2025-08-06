export interface UserInfo {
  id: string;
  nickname: string;
  username?: string;
  phoneNumber?: string;
}

export interface GetUserInfoResponseDto {
  success: boolean;
  message: string;
  data?: UserInfo;
}
