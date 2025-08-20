import { frontendAxiosInstance } from './axiosInstance';

// Step Detail 데이터 타입 정의
export interface StepDetailData {
  id: number;
  userAddressId: number;
  stepId: number;
  mismatch: number;
  match: number;
  unchecked: number;
  jsonDetails: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  stepNumber: number;
  detail: number;
}

// API 응답 타입 정의
interface StepDetailApiResponse {
  success: boolean;
  data: StepDetailData;
  message?: string;
}

// API 요청 파라미터 타입 정의
interface GetStepDetailParams {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
}

/**
 * Step Detail API 클래스
 */
class StepDetailApi {
  private static instance: StepDetailApi;

  private constructor() {}

  public static getInstance(): StepDetailApi {
    if (!StepDetailApi.instance) {
      StepDetailApi.instance = new StepDetailApi();
    }
    return StepDetailApi.instance;
  }

  /**
   * Step Detail 데이터 조회
   */
  public async getStepDetail(
    params: GetStepDetailParams
  ): Promise<StepDetailData> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      userAddressNickname: params.userAddressNickname,
      stepNumber: params.stepNumber.toString(),
      detail: params.detail.toString(),
    });

    const response = await axiosInstance.get<StepDetailApiResponse>(
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

export const stepDetailApi = StepDetailApi.getInstance();
export default stepDetailApi;
