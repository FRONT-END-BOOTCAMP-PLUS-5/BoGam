// CODEF API OAuth 2.0 인증 라이브러리
import axios from 'axios';
import { loadCodefConfig, validateCodefConfig } from './codefEnvironment';

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

export class CodefAuth {
  private config: CodefAuthConfig;
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
  async getAccessToken(): Promise<string> {
    try {
      console.log('🔐 CODEF OAuth 토큰 발급 요청 시작');

      // Basic Authentication 헤더 생성
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      const authorizationHeader = `Basic ${credentials}`;

      const response = await axios.post(this.tokenEndpoint, 
        new URLSearchParams({
          grant_type: 'client_credentials',
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorizationHeader,
          },
        }
      );

      const tokenData: CodefTokenResponse = response.data;
      
      console.log('✅ CODEF OAuth 토큰 발급 성공');
      return tokenData.access_token;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorText = error.response?.data || error.message;
        console.error('❌ OAuth 토큰 발급 실패:', errorText);
        throw new Error(`토큰 발급 실패: ${error.response?.status} ${error.response?.statusText}`);
      } else {
        console.error('❌ CODEF OAuth 토큰 발급 실패:', error);
        throw error;
      }
    }
  }

  /**
   * Authorization 헤더 생성
   */
  async getAuthorizationHeader(): Promise<string> {
    const accessToken = await this.getAccessToken();
    return `Bearer ${accessToken}`;
  }
}

// 싱글톤 인스턴스
let codefAuthInstance: CodefAuth | null = null;

/**
 * codefEnvironment에서 CODEF 인증 설정을 로드
 */
function loadCodefAuthConfig(): CodefAuthConfig {
  const config = loadCodefConfig();
  const validation = validateCodefConfig(config);
  
  if (!validation.isValid) {
    throw new Error(`CODEF 설정 검증 실패: ${validation.errors.join(', ')}`);
  }

  return {
    clientId: config.oauth.clientId,
    clientSecret: config.oauth.clientSecret,
    baseUrl: config.oauth.baseUrl,
  };
}

/**
 * CODEF 인증 인스턴스 생성 또는 반환 (환경변수 자동 로드)
 */
export function createCodefAuth(): CodefAuth {
  if (!codefAuthInstance) {
    const config = loadCodefAuthConfig();
    codefAuthInstance = new CodefAuth(config);
    console.log('🔐 CODEF 인증 싱글톤 인스턴스 생성됨');
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
  codefAuthInstance = null;
  console.log('🔄 CODEF 인증 싱글톤 인스턴스 초기화됨');
}