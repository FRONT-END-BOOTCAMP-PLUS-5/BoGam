import { frontendAxiosInstance } from './axiosInstance';

// Step Result 데이터 타입 정의 (조회용)
export interface StepResultData {
  id: number;
  userAddressId: number;
  stepId: number;
  mismatch: number;
  match: number;
  unchecked: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>;
  createdAt: string;
  updatedAt: string;
  stepNumber: number;
  detail: number;
}

// API 응답 타입 정의
interface StepResultQueryResponse {
  success: boolean;
  data: StepResultData;
  message?: string;
}

// API 요청 파라미터 타입 정의
interface GetStepResultParams {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
}

/**
 * Step Result Query API 클래스 (조회용)
 */
class StepResultQueryApi {
  private static instance: StepResultQueryApi;

  private constructor() {}

  public static getInstance(): StepResultQueryApi {
    if (!StepResultQueryApi.instance) {
      StepResultQueryApi.instance = new StepResultQueryApi();
    }
    return StepResultQueryApi.instance;
  }

  /**
   * Step Result 데이터 조회
   */
  public async getStepResult(
    params: GetStepResultParams
  ): Promise<StepResultData> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      userAddressNickname: params.userAddressNickname,
      stepNumber: params.stepNumber.toString(),
      detail: params.detail.toString(),
    });

    const response = await axiosInstance.get<StepResultQueryResponse>(
      `/api/step-results?${queryParams.toString()}`
    );

    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.message || 'API 응답에서 오류가 발생했습니다.'
      );
    }

    return response.data.data;
  }
}

export const stepResultQueryApi = StepResultQueryApi.getInstance();
export default stepResultQueryApi;
