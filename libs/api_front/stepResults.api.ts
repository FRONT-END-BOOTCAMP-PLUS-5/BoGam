import { frontendAxiosInstance } from './axiosInstance';

// step-results 요청 타입 정의
export interface StepResultRequest {
  userAddressId: number;
  stepNumber: number;
  detail: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'uncheck'>;
}

// step-results 응답 타입 정의
export interface StepResultResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    userAddressId: number;
    stepId: number;
    mismatch: number;
    match: number;
    unchecked: number;
    jsonDetails: Record<string, 'match' | 'mismatch' | 'uncheck'>;
    createdAt: string;
    updatedAt: string;
    stepNumber: number;
    detail: number;
  };
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
    stepResultData: StepResultRequest,
    options?: { excludeHeaders?: boolean }
  ): Promise<StepResultResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    // 헤더 제외 옵션이 있는 경우 새로운 axios 인스턴스 생성
    if (options?.excludeHeaders) {
      const { default: axios } = await import('axios');
      const cleanAxiosInstance = axios.create({
        baseURL: axiosInstance.defaults.baseURL,
        timeout: axiosInstance.defaults.timeout,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const response = await cleanAxiosInstance.post<StepResultResponse>(
        '/api/step-results',
        stepResultData
      );

      return response.data;
    }

    // 기본 방식 (기존 헤더 포함)
    const response = await axiosInstance.post<StepResultResponse>(
      '/api/step-results',
      stepResultData
    );

    return response.data;
  }
}

export const stepResultsApi = StepResultsApi.getInstance();
export default stepResultsApi;
