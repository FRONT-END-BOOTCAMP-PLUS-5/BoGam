import { GetRealEstateTransactionRequest } from '@be/applications/transactions/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '@be/applications/transactions/dtos/GetRealEstateTransactionResponse';
import { REAL_ESTATE_TRANSACTION_API_CONFIG } from '@libs/api-endpoints';
import PublicDataAxiosInstance from '@utils/axiosInstance';
import { parseXmlResponse } from '@utils/xmlParser';

/**
 * 실거래가 조회 API 레포지토리
 * 클린 아키텍처의 Infrastructure 레이어
 */
export class RealEstateTransactionRepository {
  private readonly baseUrl: string;
  private readonly serviceKey: string;
  private readonly axiosInstance: ReturnType<
    typeof PublicDataAxiosInstance.getInstance
  >;

  constructor() {
    this.baseUrl = REAL_ESTATE_TRANSACTION_API_CONFIG.BASE_URL;

    // 서비스키 환경변수에서 가져오기
    const serviceKey =
      process.env[REAL_ESTATE_TRANSACTION_API_CONFIG.SERVICE_KEY_ENV];
    if (!serviceKey) {
      throw new Error(
        `${REAL_ESTATE_TRANSACTION_API_CONFIG.SERVICE_KEY_ENV} 환경변수가 설정되지 않았습니다.`
      );
    }
    this.serviceKey = serviceKey;

    // 싱글톤 axios 인스턴스 사용
    this.axiosInstance = PublicDataAxiosInstance.getInstance();
  }

  /**
   * 연립다세대 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findRowHouseTradeAll(
    request: GetRealEstateTransactionRequest
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const decodedServiceKey = decodeURIComponent(this.serviceKey);

      const response = await this.axiosInstance.get(
        REAL_ESTATE_TRANSACTION_API_CONFIG.ROW_HOUSE_TRADE_FULL_URL,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text',
        }
      );
      return parseXmlResponse(
        (response as { data: string }).data
      ) as GetRealEstateTransactionResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 오피스텔 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findOfficetelTradeAll(
    request: GetRealEstateTransactionRequest
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const decodedServiceKey = decodeURIComponent(this.serviceKey);

      const response = await this.axiosInstance.get(
        REAL_ESTATE_TRANSACTION_API_CONFIG.OFFICETEL_TRADE_FULL_URL,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text',
        }
      );
      return parseXmlResponse(
        (response as { data: string }).data
      ) as GetRealEstateTransactionResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 단독/다가구 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findDetachedHouseTradeAll(
    request: GetRealEstateTransactionRequest
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const decodedServiceKey = decodeURIComponent(this.serviceKey);

      const response = await this.axiosInstance.get(
        REAL_ESTATE_TRANSACTION_API_CONFIG.DETACHED_HOUSE_TRADE_FULL_URL,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text',
        }
      );
      return parseXmlResponse(
        (response as { data: string }).data
      ) as GetRealEstateTransactionResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 아파트 매매 실거래가 조회 (기본)
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findAll(
    request: GetRealEstateTransactionRequest
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const decodedServiceKey = decodeURIComponent(this.serviceKey);

      const response = await this.axiosInstance.get(
        REAL_ESTATE_TRANSACTION_API_CONFIG.APARTMENT_TRADE_FULL_URL,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text',
        }
      );
      return parseXmlResponse(
        (response as { data: string }).data
      ) as GetRealEstateTransactionResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  /**
   * 에러 처리
   * @param error 에러 객체
   */
  private handleError(error: unknown): void {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response
    ) {
      const errorResponse = error.response as unknown;
      console.error('API 응답 에러:', errorResponse);
    } else if (
      error &&
      typeof error === 'object' &&
      'request' in error &&
      error.request
    ) {
      const errorRequest = error as unknown;
      console.error('API 요청 타임아웃 또는 네트워크 에러:', errorRequest);
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('일반 에러:', errorMessage);
    }
  }
}
