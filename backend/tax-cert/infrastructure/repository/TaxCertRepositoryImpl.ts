import { TaxCertRepository } from '../../domain/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '../../application/dtos/TaxCertDto';
import { CODEF_API_CONFIG } from '@/libs/api-endpoints';
import { createCodefAuth, CodefAuth } from '@/libs/codefAuth';
import { createCodefEncryption } from '@/libs/codefEncryption';
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
    
    // 비밀번호 필드 암호화
    const encryptedRequestBody = await this.encryptPasswordFields(requestBody);
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, encryptedRequestBody, {
        headers,
        responseType: 'text',
      });

      // 응답 Content-Type 확인
      const contentType = response.headers['content-type'];

      let data: CodefResponse;
      const responseText = response.data;
    
    // URL 인코딩된 응답인지 확인 (퍼센트 기호가 포함되어 있는지)
    if (responseText.includes('%')) {
      console.log('🔐 URL 인코딩된 응답 감지됨');
      
      // 안전한 URL 디코딩 함수
      const safeUrlDecode = (text: string): string => {
        try {
          let decoded = text;
          // 이중 인코딩된 경우를 대비해 여러 번 디코딩 시도
          for (let i = 0; i < 3; i++) {
            const prev = decoded;
            decoded = decodeURIComponent(decoded);
            if (prev === decoded) break; // 더 이상 디코딩할 수 없으면 중단
          }
          return decoded;
        } catch (error) {
          console.error('❌ URL 디코딩 중 오류:', error);
          return text; // 디코딩 실패 시 원본 반환
        }
      };
      
      try {
        // 안전한 URL 디코딩 시도
        const decodedText = safeUrlDecode(responseText);
        console.log('🔐 디코딩된 응답:', decodedText);
        
        data = JSON.parse(decodedText);
      } catch (parseError) {
        console.error('❌ 디코딩 후 JSON 파싱 실패:', parseError);
        
        // 디코딩 실패 시 원본 텍스트로 JSON 파싱 시도
        try {
          data = JSON.parse(responseText);
        } catch (finalParseError) {
          console.error('❌ 최종 JSON 파싱 실패:', finalParseError);
          throw new Error(`응답 파싱 실패: ${finalParseError}`);
        }
      }
    } else {
      // 일반 JSON 응답
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        throw new Error(`응답 파싱 실패: ${parseError}`);
      }
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

  /**
   * 비밀번호 필드들을 RSA 암호화
   */
  private async encryptPasswordFields(requestBody: TaxCertRequest | TaxCertTwoWayRequest): Promise<TaxCertRequest | TaxCertTwoWayRequest> {
    const encryption = createCodefEncryption();
    const encryptedBody = { ...requestBody };

    // 비밀번호 필드들 암호화
    if (requestBody.certPassword) {
      encryptedBody.certPassword = await encryption.encryptPassword(requestBody.certPassword);
    }
    if (requestBody.userPassword) {
      encryptedBody.userPassword = await encryption.encryptPassword(requestBody.userPassword);
    }
    if (requestBody.managePassword) {
      encryptedBody.managePassword = await encryption.encryptPassword(requestBody.managePassword);
    }

    return encryptedBody;
  }
} 