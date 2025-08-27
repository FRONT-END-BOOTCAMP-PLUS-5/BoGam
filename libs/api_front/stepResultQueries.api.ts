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

// Step Result 요청 타입 정의 (생성/수정용)
export interface StepResultRequest {
  userAddressNickname: string;
  stepNumber: number;
  detail: number;
  jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>;
}

// API 응답 타입 정의
interface StepResultQueryResponse {
  success: boolean;
  data:
    | StepResultData
    | StepResultData[]
    | { results: StepResultData[]; summary: StepResultSummaryDto };
  message?: string;
}

// Step Result 생성/수정 응답 타입 정의
interface StepResultUpsertResponse {
  success: boolean;
  data?: StepResultData;
  message?: string;
}

// 모든 stepResult 조회 응답 타입 정의
interface GetAllStepResultsResponse {
  success: boolean;
  data: StepResultData[];
  message?: string;
}

// Step Result Summary DTO 타입 정의
interface StepResultSummaryDto {
  totalMismatch: number;
  totalMatch: number;
  totalUnchecked: number;
  stepCount: number;
  stepNumber: number;
}

// API 요청 파라미터 타입 정의
interface GetStepResultParams {
  userAddressNickname: string;
  stepNumber?: string;
  detail?: string;
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
  ): Promise<
    | StepResultData
    | StepResultData[]
    | { results: StepResultData[]; summary: StepResultSummaryDto }
  > {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      userAddressNickname: params.userAddressNickname.split('+').join(' '),
    });

    if (params.stepNumber) {
      queryParams.append('stepNumber', params.stepNumber);
    }
    if (params.detail) {
      queryParams.append('detail', params.detail);
    }

    const response = await axiosInstance.get<StepResultQueryResponse>(
      `/api/step-results?${queryParams}`
    );

    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.message || 'API 응답에서 오류가 발생했습니다.'
      );
    }

    return response.data.data;
  }

  /**
   * 특정 주소의 모든 Step Result 데이터 조회
   */
  public async getAllStepResults(
    userAddressNickname: string
  ): Promise<StepResultData[]> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<GetAllStepResultsResponse>(
      `/api/step-results?userAddressNickname=${encodeURIComponent(
        userAddressNickname
      )}`
    );

    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.message || 'API 응답에서 오류가 발생했습니다.'
      );
    }

    return response.data.data || [];
  }

  /**
   * Step Result 생성/수정 (upsert)
   */
  public async upsertStepResult(
    stepResultData: StepResultRequest
  ): Promise<StepResultUpsertResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<StepResultUpsertResponse>(
      '/api/step-results',
      stepResultData
    );

    if (!response.data || !response.data.success) {
      throw new Error(
        response.data?.message || 'API 응답에서 오류가 발생했습니다.'
      );
    }

    return response.data;
  }
}

export const stepResultQueryApi = StepResultQueryApi.getInstance();
export default stepResultQueryApi;
