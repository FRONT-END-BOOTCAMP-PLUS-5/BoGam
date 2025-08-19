import { frontendAxiosInstance } from './axiosInstance';

// 실거래가 API 요청 파라미터 타입 정의
export interface TransactionRequestParams {
  LAWD_CD: string; // 법정동코드
  DEAL_YMD: string; // 거래년월 (YYYYMM)
  numOfRows?: string; // 한 페이지 결과 수
}

// 실거래가 데이터 타입 정의
export interface TransactionItem {
  aptNm: string; // 아파트명
  dealAmount: string; // 거래금액
  excluUseAr: string; // 전용면적
  floor: string; // 층
  buildYear: string; // 건축년도
  dealYear: string; // 거래년도
  dealMonth: string; // 거래월
  dealDay: string; // 거래일
  umdNm: string; // 법정동
  jibun: string; // 지번
}

// 실거래가 API 응답 타입 정의
export interface TransactionApiResponse {
  success: boolean;
  data: {
    items: {
      item: TransactionItem[];
    };
  };
  summary?: {
    totalCount: number;
    pageNo: number;
    numOfRows: number;
  };
  message?: string;
}

/**
 * 실거래가 API 클래스
 */
class TransactionsApi {
  private static instance: TransactionsApi;

  private constructor() {}

  public static getInstance(): TransactionsApi {
    if (!TransactionsApi.instance) {
      TransactionsApi.instance = new TransactionsApi();
    }
    return TransactionsApi.instance;
  }

  /**
   * 전체 실거래가 데이터 조회
   */
  public async getAllTransactions(
    params: TransactionRequestParams
  ): Promise<TransactionApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const queryParams = new URLSearchParams({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      ...(params.numOfRows && { numOfRows: params.numOfRows }),
    });

    const response = await axiosInstance.get<TransactionApiResponse>(
      `/api/transactions/all?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * 아파트 실거래가 데이터 조회
   */
  public async getApartmentTransactions(
    params: TransactionRequestParams
  ): Promise<TransactionApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const queryParams = new URLSearchParams({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      ...(params.numOfRows && { numOfRows: params.numOfRows }),
    });

    const response = await axiosInstance.get<TransactionApiResponse>(
      `/api/transactions/apartment?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * 단독/다가구 실거래가 데이터 조회
   */
  public async getDetachedHouseTransactions(
    params: TransactionRequestParams
  ): Promise<TransactionApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const queryParams = new URLSearchParams({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      ...(params.numOfRows && { numOfRows: params.numOfRows }),
    });

    const response = await axiosInstance.get<TransactionApiResponse>(
      `/api/transactions/detached-house?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * 오피스텔 실거래가 데이터 조회
   */
  public async getOfficetelTransactions(
    params: TransactionRequestParams
  ): Promise<TransactionApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const queryParams = new URLSearchParams({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      ...(params.numOfRows && { numOfRows: params.numOfRows }),
    });

    const response = await axiosInstance.get<TransactionApiResponse>(
      `/api/transactions/officetel?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * 연립/다세대 실거래가 데이터 조회
   */
  public async getRowHouseTransactions(
    params: TransactionRequestParams
  ): Promise<TransactionApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const queryParams = new URLSearchParams({
      LAWD_CD: params.LAWD_CD,
      DEAL_YMD: params.DEAL_YMD,
      ...(params.numOfRows && { numOfRows: params.numOfRows }),
    });

    const response = await axiosInstance.get<TransactionApiResponse>(
      `/api/transactions/row-house?${queryParams.toString()}`
    );

    return response.data;
  }
}

export const transactionsApi = TransactionsApi.getInstance();
export default transactionsApi;
