import { frontendAxiosInstance } from './axiosInstance';

export interface UsernameCheckResponse {
  available: boolean;
}

class UsernameApi {
  private static instance: UsernameApi;
  private constructor() {}
  public static getInstance(): UsernameApi {
    if (!UsernameApi.instance) {
      UsernameApi.instance = new UsernameApi();
    }
    return UsernameApi.instance;
  }

  public async checkUsername(username: string): Promise<UsernameCheckResponse> {
    console.log('Sending username:', username);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      console.error('Invalid email format');
    }
    const axios = frontendAxiosInstance.getAxiosInstance();
    const response = await axios.get<UsernameCheckResponse>(
      'api/users/check-username',
      {
        params: { username },
      }
    );

    return response.data;
  }
}

export const usernameCheckApi = UsernameApi.getInstance();
export default usernameCheckApi;
