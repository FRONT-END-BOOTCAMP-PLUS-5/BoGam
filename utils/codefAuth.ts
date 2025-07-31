import axios from 'axios';

/**
 * Codef API 환경 설정 인터페이스
 */
interface CodefConfig {
  clientId: string;
  clientSecret: string;
  timeout?: number;
}

/**
 * Codef API 토큰 관리 클래스
 * OAuth 토큰 획득 및 관리만 담당
 */
export class CodefAuthManager {
  private static instance: CodefAuthManager;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private config: CodefConfig;

  private constructor() {
    // 환경 변수에서 설정 로드
    this.config = {
      clientId: process.env.CODEF_DEMO_CLIENT_ID_NO || '',
      clientSecret: process.env.CODEF_DEMO_CLIENT_SECRET_NO || '',
      timeout: parseInt(process.env.CODEF_TIMEOUT || '30000'),
    };
    console.log(this.config);
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): CodefAuthManager {
    if (!CodefAuthManager.instance) {
      CodefAuthManager.instance = new CodefAuthManager();
    }
    return CodefAuthManager.instance;
  }

  /**
   * 액세스 토큰 획득
   * @returns 액세스 토큰
   */
  async getAccessToken(): Promise<string> {
    // 토큰이 유효한 경우 캐시된 토큰 반환
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(
        `${this.config.clientId}:${this.config.clientSecret}`
      ).toString('base64');

      console.log('🔐 Codef OAuth 토큰 요청 중...', {
        endpoint: 'https://oauth.codef.io/oauth/token',
        clientId: this.config.clientId,
        clientSecretLength: this.config.clientSecret.length,
        credentialsLength: credentials.length,
        grantType: 'client_credentials',
        scope: 'read',
      });

      const response = await axios.post(
        `https://oauth.codef.io/oauth/token`,
        'grant_type=client_credentials&scope=read',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: this.config.timeout,
        }
      );

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        // 토큰 만료 시간 설정 (1주일 = 7일 * 24시간 * 60분 * 60초 * 1000밀리초)
        this.tokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        console.log('✅ Codef OAuth 토큰 획득 성공', {
          tokenLength: this.accessToken!.length,
          expiresIn: '7일',
          expiryTime: new Date(this.tokenExpiry).toISOString(),
        });
        return this.accessToken!;
      } else {
        throw new Error('액세스 토큰이 응답에 포함되지 않았습니다.');
      }
    } catch (error) {
      console.error('❌ Codef OAuth 토큰 획득 실패:', error);

      // 302 리다이렉트 처리
      if (
        (
          error as {
            response?: { status?: number; headers?: { location?: string } };
          }
        ).response?.status === 302
      ) {
        const location = (
          error as { response?: { headers?: { location?: string } } }
        ).response?.headers?.location;
        if (location && location.includes('invalid-domain')) {
          throw new Error(
            '도메인 인증이 필요합니다. Codef 관리자에게 문의하세요.'
          );
        }
      }

      throw new Error('Codef OAuth 토큰 획득에 실패했습니다.');
    }
  }

  /**
   * 토큰 캐시 초기화
   */
  clearTokenCache(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
    console.log('🗑️ Codef 토큰 캐시 초기화 완료');
  }

  /**
   * 현재 설정 정보 반환
   */
  getConfig(): CodefConfig {
    return { ...this.config };
  }
}

/**
 * CodefAuthManager 인스턴스 반환 (편의 함수)
 */
export const getCodefAuth = (): CodefAuthManager => {
  return CodefAuthManager.getInstance();
};
