import { frontendAxiosInstance } from './axiosInstance';

// 실거래가 검색 데이터 타입 정의
export interface TransactionSearchData {
  // 기본 검색 정보
  complexName: string; // 단지명
  targetArea: number; // 입력한 전용면적
  targetPrice: number; // 입력한 전세 거래가 (억 단위)
  
  // 검색 결과 정보
  similarArea?: number; // 유사한 전용면적 (없을 수 있음)
  averagePrice?: number; // 해당 면적 매매 평균가 (억 단위, 없을 수 있음)
  searchResultCount: number; // 검색 결과 n건
  
  // 전용면적별 평균가 정보 (없거나 여러개)
  areaAveragePrices?: {
    area: number; // 면적
    averagePrice: number; // 거래평균액 (억 단위)
    transactionCount: number; // 거래 건수
  }[];
}

// 실거래가 검색 데이터 저장 요청 DTO 타입
export interface CreateTransactionSearchRequestDto extends TransactionSearchData {
  userAddressNickname?: string; // 사용자 주소 닉네임 (DB 저장용)
}

// API 응답 타입 (DB 저장 포함)
export interface TransactionSearchApiResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
  };
  warning?: string;
  error?: string;
}

// 실거래가 검색 복사본 조회 요청 파라미터 타입 정의
export interface TransactionSearchCopyRequestParams {
  userAddressNickname: string;
}

// 실거래가 검색 복사본 데이터 타입 정의
export interface TransactionSearchCopyData {
  id: number;
  userAddressId: number;
  transactionSearchData: TransactionSearchData; // 실거래가 검색 JSON 데이터
  createdAt: string;
  updatedAt: string;
}

// 실거래가 검색 복사본 존재 여부 확인 응답 타입 정의
export interface TransactionSearchCopyExistsResponse {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  error?: string;
}

// 실거래가 검색 복사본 API 응답 타입 정의
export interface TransactionSearchCopyApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: TransactionSearchData;
}

// API 함수
export const createTransactionSearch = async (
  data: CreateTransactionSearchRequestDto
): Promise<TransactionSearchApiResponse> => {
  const response = await frontendAxiosInstance
    .getAxiosInstance()
    .post('/api/transaction-search', data);
  return response.data as TransactionSearchApiResponse;
};

/**
 * 실거래가 검색 복사본 API 클래스
 */
class TransactionSearchCopyApi {
  private static instance: TransactionSearchCopyApi;

  private constructor() {}

  public static getInstance(): TransactionSearchCopyApi {
    if (!TransactionSearchCopyApi.instance) {
      TransactionSearchCopyApi.instance = new TransactionSearchCopyApi();
    }
    return TransactionSearchCopyApi.instance;
  }

  /**
   * 실거래가 검색 복사본 존재 여부 확인
   */
  public async checkTransactionSearchCopyExists(
    userAddressNickname: string
  ): Promise<TransactionSearchCopyExistsResponse> {
    try {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get(`/api/transaction-search/exists?userAddressNickname=${encodeURIComponent(userAddressNickname)}`);
      return response.data as TransactionSearchCopyExistsResponse;
    } catch (error) {
      console.error('실거래가 검색 복사본 존재 여부 확인 오류:', error);
      throw error;
    }
  }

  /**
   * 실거래가 검색 복사본 조회
   */
  public async getTransactionSearchCopy(
    params: TransactionSearchCopyRequestParams
  ): Promise<TransactionSearchCopyApiResponse> {
    try {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get('/api/transaction-search/copies', {
          params: { userAddressNickname: params.userAddressNickname },
        });
      return response.data as TransactionSearchCopyApiResponse;
    } catch (error) {
      console.error('실거래가 검색 복사본 조회 오류:', error);
      throw error;
    }
  }
}

export const transactionSearchCopyApi = TransactionSearchCopyApi.getInstance();
export default transactionSearchCopyApi;
