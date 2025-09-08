export interface UserInfo {
  id: string;
  nickname: string;
  username?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserInfoResponseDto {
  success: boolean;
  message: string;
  data?: UserInfo;
}
