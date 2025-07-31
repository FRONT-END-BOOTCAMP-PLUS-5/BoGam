// CODEF API 설정 관리
export interface CodefApiConfig {
  // OAuth 2.0 인증 설정
  oauth: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
  };
  
  // API 설정
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  // 암호화 설정
  encryption: {
    publicKey: string;
  };
  
  // 환경 설정
  environment: 'development' | 'production';
}

/**
 * 환경 변수에서 CODEF API 설정 로드
 */
export function loadCodefConfig(): CodefApiConfig {
  const environment = process.env.NODE_ENV || 'development';
  
  return {
    oauth: {
      clientId: process.env.CODEF_DEMO_CLIENT_ID || '',
      clientSecret: process.env.CODEF_DEMO_CLIENT_SECRET || '',
      baseUrl: process.env.CODEF_OAUTH_BASE_URL || 'https://oauth.codef.io',
    },
    api: {
      baseUrl: process.env.CODEF_API_BASE_URL || 'https://development.codef.io',
      timeout: parseInt(process.env.CODEF_API_TIMEOUT || '30000'),
    },
    encryption: {
      publicKey: process.env.CODEF_PUBLIC_KEY || '',
    },
    environment: environment as 'development' | 'production',
  };
}

/**
 * 설정 유효성 검사
 */
export function validateCodefConfig(config: CodefApiConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.oauth.clientId) {
    errors.push('CODEF_DEMO_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
  }
  
  if (!config.oauth.clientSecret) {
    errors.push('CODEF_DEMO_CLIENT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  
  if (!config.oauth.baseUrl) {
    errors.push('CODEF_OAUTH_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }
  
  if (!config.api.baseUrl) {
    errors.push('CODEF_API_BASE_URL 환경 변수가 설정되지 않았습니다.');
  }
  
  if (!config.encryption.publicKey) {
    errors.push('CODEF_PUBLIC_KEY 환경 변수가 설정되지 않았습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 개발 환경용 기본 설정
 */
export function getDefaultCodefConfig(): CodefApiConfig {
  return {
    oauth: {
      clientId: 'your_demo_client_id_here',
      clientSecret: 'your_demo_client_secret_here',
      baseUrl: 'https://oauth.codef.io',
    },
    api: {
      baseUrl: 'https://development.codef.io',
      timeout: 30000,
    },
    encryption: {
      publicKey: 'your_public_key_here',
    },
    environment: 'development',
  };
} 