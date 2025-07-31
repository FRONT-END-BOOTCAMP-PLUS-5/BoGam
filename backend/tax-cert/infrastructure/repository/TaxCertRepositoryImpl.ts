import { TaxCertRepository } from '../../domain/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse } from '../../application/dtos/TaxCertDto';
import { CODEF_API_CONFIG } from '@/libs/api-endpoints';
import { createCodefAuth, getCodefAuth, CodefAuth } from '@/libs/codefAuth';
import { loadCodefConfig, validateCodefConfig } from '@/libs/codefEnvironment';

export class TaxCertRepositoryImpl implements TaxCertRepository {
  private readonly baseUrl = CODEF_API_CONFIG.BASE_URL;
  private readonly endpoint = CODEF_API_CONFIG.TAX_CERT_ENDPOINT;
  private codefAuth: CodefAuth;

  constructor() {
    // CODEF 인증 설정 로드
    const config = loadCodefConfig();
    const validation = validateCodefConfig(config);
    
    if (!validation.isValid) {
      console.warn('⚠️ CODEF 설정 검증 실패:', validation.errors);
      console.warn('⚠️ 기본 설정으로 진행합니다.');
    }
    
    // CODEF 인증 인스턴스 생성
    this.codefAuth = createCodefAuth({
      clientId: config.oauth.clientId,
      clientSecret: config.oauth.clientSecret,
      baseUrl: config.oauth.baseUrl,
    });
  }

  private async callCodefApi(requestBody: TaxCertRequest | TaxCertTwoWayRequest): Promise<CodefResponse> {
    const url = `${this.baseUrl}${this.endpoint}`;
    
    console.log('🔐 CODEF API 호출:', {
      url,
      method: 'POST',
      requestBodyKeys: Object.keys(requestBody),
      is2Way: 'is2Way' in requestBody ? requestBody.is2Way : false,
    });

    // OAuth 인증 헤더 가져오기
    const authorization = await this.codefAuth.getAuthorizationHeader();
    
    const headers = {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    };
    
    console.log('🔐 인증 헤더 준비 완료:', {
      hasAuthorization: !!headers.Authorization,
      authorizationPrefix: headers.Authorization?.substring(0, 10) + '...',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ CODEF API 호출 실패:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    // 응답 Content-Type 확인
    const contentType = response.headers.get('content-type');
    console.log('🔐 응답 Content-Type:', contentType);

    let data: CodefResponse;
    const responseText = await response.text();
    console.log('🔐 원본 응답 텍스트:', responseText);
    
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
  }

  async requestTaxCert(request: TaxCertRequest): Promise<CodefResponse> {
    console.log('📄 기본 납세증명서 요청 처리:', {
      loginType: request.loginType,
      certType: request.certType,
      proofType: request.proofType,
      submitTargets: request.submitTargets,
      applicationType: request.applicationType,
      clientTypeLevel: request.clientTypeLevel,
      hasUserName: !!request.userName,
      hasLoginIdentity: !!request.loginIdentity,
      hasPhoneNo: !!request.phoneNo,
      hasLoginTypeLevel: !!request.loginTypeLevel,
    });

    return this.callCodefApi(request);
  }

  async requestTaxCertTwoWay(request: TaxCertTwoWayRequest): Promise<CodefResponse> {
    console.log('🔐 추가인증 요청 처리:', {
      jobIndex: request.twoWayInfo?.jobIndex,
      threadIndex: request.twoWayInfo?.threadIndex,
      jti: request.twoWayInfo?.jti,
      simpleAuth: request.simpleAuth,
      hasSignedData: !!request.signedData,
      hasSimpleKeyToken: !!request.simpleKeyToken,
      hasRValue: !!request.rValue,
      hasCertificate: !!request.certificate,
      hasExtraInfo: !!request.extraInfo,
    });

    // 간편인증 추가 필드들 처리
    if (request.extraInfo) {
      const extraInfo = request.extraInfo;
      if (extraInfo.simpleKeyToken) {
        (request as any).simpleKeyToken = extraInfo.simpleKeyToken;
        console.log('🔐 카카오 간편인증 토큰 처리:', {
          hasToken: !!extraInfo.simpleKeyToken,
          tokenLength: extraInfo.simpleKeyToken?.length || 0,
          isKakaoToken: extraInfo.simpleKeyToken?.includes('kakao') || 
                        extraInfo.simpleKeyToken?.startsWith('eyJ') ||
                        extraInfo.simpleKeyToken?.length > 100,
          isRealToken: extraInfo.simpleKeyToken !== 'auto_generated_token' && 
                      extraInfo.simpleKeyToken !== 'test_token' &&
                      !extraInfo.simpleKeyToken?.includes('test_token')
        });
      }
      if (extraInfo.rValue) {
        (request as any).rValue = extraInfo.rValue;
      }
      if (extraInfo.certificate) {
        (request as any).certificate = extraInfo.certificate;
      }
      console.log('🔐 간편인증 추가 필드 처리:', {
        hasSimpleKeyToken: !!extraInfo.simpleKeyToken,
        hasRValue: !!extraInfo.rValue,
        hasCertificate: !!extraInfo.certificate,
      });
    }

    return this.callCodefApi(request);
  }
} 