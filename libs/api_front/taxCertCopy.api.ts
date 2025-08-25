import { frontendAxiosInstance } from './axiosInstance';

// 납세증명서 복사본 조회 요청 파라미터 타입 정의
export interface TaxCertCopyRequestParams {
  userAddressNickname: string;
}

// 납세증명서 JSON 데이터 타입 정의
export interface TaxCertJsonData {
  [key: string]: string | number | boolean | null | undefined;
}

// 납세증명서 복사본 데이터 타입 정의
export interface TaxCertCopyData {
  id: number;
  userAddressId: number;
  taxCertJson: TaxCertJsonData; // 납세증명서 JSON 데이터
  createdAt: string;
  updatedAt: string;
}

// 납세증명서 복사본 API 응답 타입 정의
export interface TaxCertCopyApiResponse {
  success: boolean;
  message: string;
  data?: TaxCertCopyData;
}

/**
 * 납세증명서 복사본 API 클래스
 */
class TaxCertCopyApi {
  private static instance: TaxCertCopyApi;

  private constructor() {}

  public static getInstance(): TaxCertCopyApi {
    if (!TaxCertCopyApi.instance) {
      TaxCertCopyApi.instance = new TaxCertCopyApi();
    }
    return TaxCertCopyApi.instance;
  }

  /**
   * 납세증명서 복사본 조회
   */
  public async getTaxCertCopy(
    params: TaxCertCopyRequestParams
  ): Promise<TaxCertCopyApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();
    
    const response = await axiosInstance.get<TaxCertCopyApiResponse>(
      `/api/copies/tax-cert?userAddressNickname=${encodeURIComponent(params.userAddressNickname)}`
    );

    return response.data;
  }
}

export const taxCertCopyApi = TaxCertCopyApi.getInstance();
export default taxCertCopyApi;
