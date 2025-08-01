import axios from 'axios';
import { GetRealEstateTransactionRequest } from '../../applications/realEstate/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '../../applications/realEstate/dtos/GetRealEstateTransactionResponse';
import PublicDataAxiosInstance from '@utils/axiosInstance';
import { parseXmlResponse } from '@utils/xmlParser';

/**
 * 실거래가 조회 API 레포지토리
 * 클린 아키텍처의 Infrastructure 레이어
 */
export class RealEstateTransactionRepository {
  private readonly baseUrl: string;
  private readonly serviceKey: string;
  private readonly axiosInstance: ReturnType<typeof PublicDataAxiosInstance.getInstance>;

  constructor() {
    this.baseUrl = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent';
    
    // 서비스키 환경변수에서 가져오기
    const serviceKey = process.env.RTMSDATA_TRANSACTION_PRICE_KEY;
    if (!serviceKey) {
      throw new Error('RTMSDATA_TRANSACTION_PRICE_KEY 환경변수가 설정되지 않았습니다.');
    }
    this.serviceKey = serviceKey;
    
    // 싱글톤 axios 인스턴스 사용
    this.axiosInstance = PublicDataAxiosInstance.getInstance();
  }

  /**
   * 아파트 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // 서비스키 디코딩 (URL 인코딩된 경우)
      const decodedServiceKey = decodeURIComponent(this.serviceKey);
      
      // API 요청 실행
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcAptRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text', // XML 응답을 텍스트로 받기
        }
      );
      
      // XML을 JSON으로 파싱
      return parseXmlResponse((response as { data: string }).data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 단독/다가구 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findDetachedHouseAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // 서비스키 디코딩 (URL 인코딩된 경우)
      const decodedServiceKey = decodeURIComponent(this.serviceKey);
      
      // API 요청 실행
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcSHRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text', // XML 응답을 텍스트로 받기
        }
      );
      
      // XML을 JSON으로 파싱
      return parseXmlResponse((response as { data: string }).data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 오피스텔 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findOfficetelAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // 서비스키 디코딩 (URL 인코딩된 경우)
      const decodedServiceKey = decodeURIComponent(this.serviceKey);
      
      // API 요청 실행
      const response = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcORTRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text', // XML 응답을 텍스트로 받기
        }
      );
      
      // XML을 JSON으로 파싱
      return parseXmlResponse((response as { data: string }).data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 지역코드와 계약년월로 실거래가 조회 (편의 메서드)
   * @param lawdCd 지역코드 (법정동코드 5자리)
   * @param dealYmd 계약년월 (YYYYMM 형식)
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async findByLocationAndDate(
    lawdCd: string,
    dealYmd: string,
    options: {
      numOfRows?: string;
      pageNo?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    const request: GetRealEstateTransactionRequest = {
      LAWD_CD: lawdCd,
      DEAL_YMD: dealYmd,
      numOfRows: options.numOfRows || '10',
      pageNo: options.pageNo || '1',
    };

    return this.findAll(request);
  }

  /**
   * 에러 처리
   * @param error 에러 객체
   */
  private handleError(error: any): void {
    if ('response' in error && error.response) {
      console.error('API 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if ('request' in error && error.request) {
      console.error('API 요청 타임아웃 또는 네트워크 에러:', error.message);
    } else {
      console.error('일반 에러:', error.message || error);
    }
  }
} 