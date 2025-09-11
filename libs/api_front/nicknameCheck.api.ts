import { frontendAxiosInstance } from './axiosInstance';

export interface NicknameCheckResponse {
  available: boolean;
}

class NicknameApi {
  private static instance: NicknameApi;
  private constructor() {}

  public static getInstance(): NicknameApi {
    if (!NicknameApi.instance) {
      NicknameApi.instance = new NicknameApi();
    }
    return NicknameApi.instance;
  }

  public async checkNickname(nickname: string): Promise<NicknameCheckResponse> {
    const axios = frontendAxiosInstance.getAxiosInstance();

    const response = await axios.get<NicknameCheckResponse>(
      'users/check-nickname',
      {
        params: { nickname },
      }
    );

    return response.data;
  }
}

export const nicknameCheckApi = NicknameApi.getInstance();
export default nicknameCheckApi;
