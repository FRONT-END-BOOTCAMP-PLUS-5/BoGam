import { frontendAxiosInstance } from './axiosInstance';

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  deletedUserNickname?: string;
}

class AuthApi {
  private static instance: AuthApi;
  private constructor() {}
  
  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  public async deleteUser(): Promise<DeleteUserResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();
    
    const response = await axiosInstance.delete<DeleteUserResponse>('/api/auth/delete-user');
    return response.data;
  }
}

export const authApi = AuthApi.getInstance();
export default authApi;
