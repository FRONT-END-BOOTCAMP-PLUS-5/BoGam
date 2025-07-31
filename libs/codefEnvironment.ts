// Codef API 설정
interface CodefConfig {
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

export const CODEF_CONFIG = {
  // 데모 버전 (테스트용)
  demo: {
    clientId: process.env.CODEF_DEMO_CLIENT_ID_JO,
    clientSecret: process.env.CODEF_DEMO_CLIENT_SECRET_JO,
    apiUrl: 'https://development.codef.io',
    oauthBaseUrl: 'https://oauth.codef.io',
    timeout: parseInt(process.env.CODEF_TIMEOUT || '30000'),
  },

  // 공개키 (필수)
  publicKey: process.env.CODEF_PUBLIC_KEY_JO,

  // 현재 사용할 환경 (데모만 사용)
  environment: 'demo' as const,
};

export type CodefEnvironment = 'demo';

// 현재 환경의 설정 가져오기
export function getCurrentConfig() {
  const config = CODEF_CONFIG.demo;
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    apiUrl: config.apiUrl,
    oauthBaseUrl: config.oauthBaseUrl,
    timeout: config.timeout,
    publicKey: CODEF_CONFIG.publicKey,
    environment: CODEF_CONFIG.environment,
  };
}

// 설정 로드 (환경변수 기반)
export function loadCodefConfig(): CodefConfig {
  const config = getCurrentConfig();
  
  return {
    oauth: {
      clientId: config.clientId || '',
      clientSecret: config.clientSecret || '',
      baseUrl: config.oauthBaseUrl || 'https://oauth.codef.io',
    },
    api: {
      baseUrl: config.apiUrl || 'https://development.codef.io',
      timeout: config.timeout || 30000,
    },
    encryption: {
      publicKey: config.publicKey || '',
    },
    environment: 'development',
  };
}

// 설정 검증
export function validateCodefConfig(config: CodefConfig) {
  const errors: string[] = [];
  
  if (!config.oauth.clientId) {
    errors.push('CODEF_DEMO_CLIENT_ID_JO 환경변수가 설정되지 않았습니다.');
  }
  
  if (!config.oauth.clientSecret) {
    errors.push('CODEF_DEMO_CLIENT_SECRET_JO 환경변수가 설정되지 않았습니다.');
  }
  
  if (!config.encryption.publicKey) {
    errors.push('CODEF_PUBLIC_KEY_JO 환경변수가 설정되지 않았습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config,
  };
}