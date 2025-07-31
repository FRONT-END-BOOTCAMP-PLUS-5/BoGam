import { TaxCertRepository } from '../../domain/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '../../application/dtos/TaxCertDto';
import { CODEF_API_CONFIG } from '@/libs/api-endpoints';
import { createCodefAuth, CodefAuth } from '@/libs/codefAuth';
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
        responseType: 'text',
      });

      let data: CodefResponse;
      const responseText = response.data;
    
      // JSON 파싱
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        throw new Error(`응답 파싱 실패: ${parseError}`);
      }

      console.log('🔐 CODEF API 응답:', {
        status: response.status,
        resultCode: data?.result?.code,
        resultMessage: data?.result?.message,
        hasData: !!data?.data,
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorText = error.response?.data || error.message;
        console.error('❌ CODEF API 호출 실패:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          error: errorText,
        });
        throw new Error(`HTTP error! status: ${error.response?.status} - ${errorText}`);
      } else {
        console.error('❌ CODEF API 호출 중 예상치 못한 오류:', error);
        throw new Error(`예상치 못한 오류: ${error}`);
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