import { frontendAxiosInstance } from './axiosInstance';
import { StepResultData } from './stepResultQueries.api';

// step-results 요청 타입 정의
export interface StepResultRequest {
  userAddressId: number;
  stepNumber: number;
  detail: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>;
}

// step-results 응답 타입 정의
export interface StepResultResponse {
  success: boolean;
  message: string;
  data?: StepResultData;
}

/**
 * Step Results API 클래스
 */
class StepResultsApi {
  private static instance: StepResultsApi;

  private constructor() {}

  public static getInstance(): StepResultsApi {
    if (!StepResultsApi.instance) {
      StepResultsApi.instance = new StepResultsApi();
    }
    return StepResultsApi.instance;
  }

  /**
   * step-results 생성/수정 (같은 URL에 POST 사용)
   */
  public async createOrUpdateStepResult(
    stepResultData: StepResultRequest
  ): Promise<StepResultResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<StepResultResponse>(
      '/api/step-results',
      stepResultData
    );

    return response.data;
  }
}

export const stepResultsApi = StepResultsApi.getInstance();
export default stepResultsApi;
