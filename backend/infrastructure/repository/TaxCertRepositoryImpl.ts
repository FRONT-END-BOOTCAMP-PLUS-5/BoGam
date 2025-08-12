import { TaxCertRepository } from '@be/domain/repository/TaxCertRepository';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { CODEF_API_CONFIG } from '@libs/api-endpoints';
import { createCodefAuth, CodefAuth } from '@libs/codef/codefAuth';
import { processResponse } from '@libs/responseUtils';
import axios from 'axios';
import { GetTaxCertResponseDto } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export class TaxCertRepositoryImpl implements TaxCertRepository {
  private readonly baseUrl = CODEF_API_CONFIG.BASE_URL;
  private readonly endpoint = CODEF_API_CONFIG.TAX_CERT_ENDPOINT;
  private codefAuth: CodefAuth;

  constructor() {
    // CODEF 인증 싱글톤 인스턴스 생성 (환경변수 자동 로드)
    this.codefAuth = createCodefAuth();
  }

  private async callCodefApi(
    requestBody: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto> {
    const url = `${this.baseUrl}${this.endpoint}`;

    // OAuth 인증 헤더 가져오기
    const authorization = await this.codefAuth.getAuthorizationHeader();

    const headers = {
      Authorization: authorization,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers,
        // responseType을 제거하여 axios가 자동으로 Content-Type에 따라 처리하도록 함
      });

      // 응답 데이터 처리 (URL 디코딩 + JSON 파싱)
      const data: GetTaxCertResponseDto =
        processResponse<GetTaxCertResponseDto>(response.data);

      return data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as {
          response?: { status?: number; statusText?: string; data?: unknown };
          message?: string;
        };
        const errorText =
          httpError.response?.data || httpError.message || 'Unknown error';
        console.error('❌ CODEF API 호출 실패:', {
          status: httpError.response?.status,
          statusText: httpError.response?.statusText,
          error: errorText,
        });
        throw new Error(
          `HTTP error! status: ${httpError.response?.status} - ${errorText}`
        );
      } else {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('❌ CODEF API 호출 중 예상치 못한 오류:', error);
        throw new Error(`예상치 못한 오류: ${errorMessage}`);
      }
    }
  }

  async requestTaxCert(
    request: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto> {
    return this.callCodefApi(request);
  }

  async requestTaxCertTwoWay(
    request: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto> {
    // 2-way 요청인지 확인하고 타입 가드 사용
    if ('is2Way' in request && request.is2Way) {
      const twoWayRequest = request;

      // 간편인증 추가 필드들 처리
      if (twoWayRequest.extraInfo) {
        const extraInfo = twoWayRequest.extraInfo;
        if (extraInfo.simpleKeyToken) {
          twoWayRequest.simpleKeyToken = extraInfo.simpleKeyToken;
        }
        if (extraInfo.rValue) {
          twoWayRequest.rValue = extraInfo.rValue;
        }
        if (extraInfo.certificate) {
          twoWayRequest.certificate = extraInfo.certificate;
        }
      }
    }

    return this.callCodefApi(request);
  }
}
