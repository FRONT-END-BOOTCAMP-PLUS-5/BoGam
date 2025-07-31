// CODEF API OAuth 2.0 인증 라이브러리
export interface CodefAuthConfig {
  clientId: string;
  clientSecret: string;
  baseUrl?: string;
}

export interface CodefTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface CodefTokenInfo {
  accessToken: string;
  expiresAt: number;
  tokenType: string;
}

export class CodefAuth {
  private config: CodefAuthConfig;
  private tokenInfo: CodefTokenInfo | null = null;
  private tokenEndpoint: string;

  constructor(config: CodefAuthConfig) {
    this.config = {
      baseUrl: 'https://oauth.codef.io',
      ...config
    };
    this.tokenEndpoint = `${this.config.baseUrl}/oauth/token`;
  }

  /**
   * accessToken 발급 요청
   */
  async requestAccessToken(): Promise<CodefTokenInfo> {
    try {
      console.log('🔐 CODEF OAuth 토큰 발급 요청 시작');
      console.log('🔐 토큰 엔드포인트:', this.tokenEndpoint);
      console.log('🔐 클라이언트 ID:', this.config.clientId ? `${this.config.clientId.substring(0, 8)}...` : '빈 값');
      console.log('🔐 클라이언트 시크릿:', this.config.clientSecret ? `${this.config.clientSecret.substring(0, 8)}...` : '빈 값');

      // Basic Authentication 헤더 생성
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      const authorizationHeader = `Basic ${credentials}`;

      console.log('🔐 Authorization 헤더:', authorizationHeader.substring(0, 20) + '...');

      const response = await fetch(this.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authorizationHeader,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      console.log('🔐 응답 상태:', response.status, response.statusText);
      console.log('🔐 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OAuth 토큰 발급 실패 - 응답 내용:', errorText);
        throw new Error(`토큰 발급 실패: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokenData: CodefTokenResponse = await response.json();
      
      // 토큰 만료 시간 계산 (현재 시간 + expires_in 초)
      const expiresAt = Date.now() + (tokenData.expires_in * 1000);
      
      this.tokenInfo = {
        accessToken: tokenData.access_token,
        expiresAt,
        tokenType: tokenData.token_type,
      };

      console.log('✅ CODEF OAuth 토큰 발급 성공:', {
        tokenType: this.tokenInfo.tokenType,
        expiresIn: tokenData.expires_in,
        expiresAt: new Date(this.tokenInfo.expiresAt).toISOString(),
      });

      return this.tokenInfo;

    } catch (error) {
      console.error('❌ CODEF OAuth 토큰 발급 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 토큰이 유효한지 확인
   */
  isTokenValid(): boolean {
    if (!this.tokenInfo) {
      return false;
    }

    // 만료 5분 전부터는 갱신 필요로 판단
    const now = Date.now();
    const refreshThreshold = 5 * 60 * 1000; // 5분
    
    return this.tokenInfo.expiresAt > (now + refreshThreshold);
  }

  /**
   * 유효한 accessToken 반환 (필요시 갱신)
   */
  async getValidAccessToken(): Promise<string> {
    if (!this.isTokenValid()) {
      console.log('🔄 토큰이 만료되었거나 유효하지 않음. 토큰 갱신 중...');
      await this.requestAccessToken();
    }

    if (!this.tokenInfo) {
      throw new Error('토큰 발급에 실패했습니다.');
    }

    return this.tokenInfo.accessToken;
  }

  /**
   * Authorization 헤더 생성
   */
  async getAuthorizationHeader(): Promise<string> {
    const accessToken = await this.getValidAccessToken();
    return `Bearer ${accessToken}`;
  }

  /**
   * API 요청용 헤더 생성
   */
  async getRequestHeaders(additionalHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const authorization = await this.getAuthorizationHeader();
    
    return {
      'Authorization': authorization,
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };
  }

  /**
   * 토큰 정보 조회
   */
  getTokenInfo(): CodefTokenInfo | null {
    return this.tokenInfo;
  }

  /**
   * 토큰 만료 시간 조회
   */
  getTokenExpiresAt(): Date | null {
    return this.tokenInfo ? new Date(this.tokenInfo.expiresAt) : null;
  }

  /**
   * 토큰 만료까지 남은 시간 (밀리초)
   */
  getTokenTimeRemaining(): number {
    if (!this.tokenInfo) {
      return 0;
    }
    
    const now = Date.now();
    return Math.max(0, this.tokenInfo.expiresAt - now);
  }

  /**
   * 토큰 정보 초기화
   */
  clearToken(): void {
    this.tokenInfo = null;
    console.log('🗑️ 토큰 정보 초기화됨');
  }
}

// 싱글톤 인스턴스 생성
let codefAuthInstance: CodefAuth | null = null;

/**
 * CODEF 인증 인스턴스 생성 또는 반환
 */
export function createCodefAuth(config: CodefAuthConfig): CodefAuth {
  if (!codefAuthInstance) {
    codefAuthInstance = new CodefAuth(config);
    console.log('🔐 CODEF 인증 인스턴스 생성됨');
  }
  return codefAuthInstance;
}

/**
 * 기존 CODEF 인증 인스턴스 반환
 */
export function getCodefAuth(): CodefAuth | null {
  return codefAuthInstance;
}

/**
 * CODEF 인증 인스턴스 초기화
 */
export function resetCodefAuth(): void {
  if (codefAuthInstance) {
    codefAuthInstance.clearToken();
  }
  codefAuthInstance = null;
  console.log('🔄 CODEF 인증 인스턴스 초기화됨');
} 