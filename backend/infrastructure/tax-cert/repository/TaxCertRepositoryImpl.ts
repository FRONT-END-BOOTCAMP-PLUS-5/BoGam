import { TaxCertRepository } from '../../../domain/tax-cert/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '../../../applications/tax-cert/dtos/TaxCertDto';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { createCodefAuth, CodefAuth } from '@libs/codefAuth';
import { processResponse } from '@libs/responseUtils';
import axios from 'axios';

export class TaxCertRepositoryImpl implements TaxCertRepository {
  private readonly baseUrl = CODEF_API_CONFIG.BASE_URL;
  private readonly endpoint = CODEF_API_CONFIG.TAX_CERT_ENDPOINT;
  private codefAuth: CodefAuth;

  constructor() {
    // CODEF 인증 싱글톤 인스턴스 생성 (환경변수 자동 로드)
    this.codefAuth = createCodefAuth();
  }

  private async callCodefApi(requestBody: TaxCertRequest | TaxCertTwoWayRequest): Promise<CodefResponse> {
    const url = `${this.baseUrl}${this.endpoint}`;

    // OAuth 인증 헤더 가져오기
    const authorization = await this.codefAuth.getAuthorizationHeader();
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers,
        // responseType을 제거하여 axios가 자동으로 Content-Type에 따라 처리하도록 함
      });

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: CodefResponse = processResponse<CodefResponse>(response.data);
      
      console.log('🔐 CODEF API 응답:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
      });

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response?: { status?: number; statusText?: string; data?: any }; message?: string };
        const errorText = httpError.response?.data || httpError.message || 'Unknown error';
        console.error('❌ CODEF API 호출 실패:', {
          status: httpError.response?.status,
          statusText: httpError.response?.statusText,
          error: errorText,
        });
        throw new Error(`HTTP error! status: ${httpError.response?.status} - ${errorText}`);
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ CODEF API 호출 중 예상치 못한 오류:', error);
        throw new Error(`예상치 못한 오류: ${errorMessage}`);
      }
    }
  }

  async requestTaxCert(request: TaxCertRequest): Promise<CodefResponse> {
    return this.callCodefApi(request);
  }

  async requestTaxCertTwoWay(request: TaxCertTwoWayRequest): Promise<CodefResponse> {
    // 간편인증 추가 필드들 처리
    if (request.extraInfo) {
      const extraInfo = request.extraInfo;
      if (extraInfo.simpleKeyToken) {
        request.simpleKeyToken = extraInfo.simpleKeyToken;
      }
      if (extraInfo.rValue) {
        request.rValue = extraInfo.rValue;
      }
      if (extraInfo.certificate) {
        request.certificate = extraInfo.certificate;
      }
    }

    return this.callCodefApi(request);
  }

} 