import axios from 'axios';

/**
 * 보증한도 복사본 관련 API 인터페이스
 */

export interface GuaranteeLimitCopyRequestParams {
  userAddressNickname: string;
}

export interface CreateGuaranteeLimitCopyParams {
  userAddressNickname: string;
  guaranteeLimitJson: string;
}

export interface GuaranteeLimitCopyData {
  id: number;
  userAddressId: number;
  guaranteeLimitJson: Record<string, unknown>;
  updatedAt: string;
}

export interface GuaranteeLimitCopyApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: GuaranteeLimitCopyData;
}

export interface CheckGuaranteeLimitCopyExistsApiResponse {
  success: boolean;
  exists: boolean;
  message?: string;
  error?: string;
  updatedAt?: string;
}

/**
 * 보증한도 복사본 API 클래스
 * 싱글톤 패턴으로 구현
 */
class GuaranteeLimitCopyApi {
  private static instance: GuaranteeLimitCopyApi;

  private constructor() {}

  public static getInstance(): GuaranteeLimitCopyApi {
    if (!GuaranteeLimitCopyApi.instance) {
      GuaranteeLimitCopyApi.instance = new GuaranteeLimitCopyApi();
    }
    return GuaranteeLimitCopyApi.instance;
  }

  /**
   * 보증한도 복사본 조회
   */
  public async getGuaranteeLimitCopy(
    params: GuaranteeLimitCopyRequestParams
  ): Promise<GuaranteeLimitCopyApiResponse> {
    try {
      const response = await axios.get('/api/copies/guarantee-limit', {
        params: { userAddressNickname: params.userAddressNickname },
      });
      return response.data as GuaranteeLimitCopyApiResponse;
    } catch (error) {
      console.error('보증한도 복사본 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 보증한도 복사본 생성/수정
   */
  public async createGuaranteeLimitCopy(
    params: CreateGuaranteeLimitCopyParams
  ): Promise<GuaranteeLimitCopyApiResponse> {
    try {
      const response = await axios.post('/api/copies/guarantee-limit', {
        userAddressNickname: params.userAddressNickname,
        guaranteeLimitJson: params.guaranteeLimitJson,
      });
      return response.data as GuaranteeLimitCopyApiResponse;
    } catch (error) {
      console.error('보증한도 복사본 생성/수정 오류:', error);
      throw error;
    }
  }

  /**
   * 보증한도 복사본 존재 여부 확인
   */
  public async checkGuaranteeLimitCopyExists(
    userAddressNickname: string
  ): Promise<CheckGuaranteeLimitCopyExistsApiResponse> {
    try {
      const response = await axios.get('/api/guarantee-limit/exists', {
        params: { userAddressNickname },
      });
      return response.data as CheckGuaranteeLimitCopyExistsApiResponse;
    } catch (error) {
      console.error('보증한도 복사본 존재 여부 확인 오류:', error);
      throw error;
    }
  }
}

export default GuaranteeLimitCopyApi;
