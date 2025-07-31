// Codef API 설정
interface CodefEnvironmentConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
}

export const CODEF_CONFIG = {
  // 데모 버전 (테스트용)
  demo: {
    clientId: process.env.CODEF_DEMO_CLIENT_ID_NO,
    clientSecret: process.env.CODEF_DEMO_CLIENT_SECRET_NO,
    apiUrl: 'https://development.codef.io',
  } as CodefEnvironmentConfig,

  // 샌드박스 버전 (개발용)
  sandbox: {
    clientId: process.env.CODEF_SANDBOX_CLIENT_ID,
    clientSecret: process.env.CODEF_SANDBOX_CLIENT_SECRET,
    apiUrl: 'https://sandbox.codef.io',
  } as CodefEnvironmentConfig,

  // 프로덕션 버전
  production: {
    clientId: process.env.CODEF_PRODUCTION_CLIENT_ID,
    clientSecret: process.env.CODEF_PRODUCTION_CLIENT_SECRET,
    apiUrl: 'https://api.codef.io',
  } as CodefEnvironmentConfig,

  // 공개키 (필수)
  publicKey: process.env.CODEF_PUBLIC_KEY_NO,

  // 현재 사용할 환경
  environment: (process.env.CODEF_ENVIRONMENT || 'demo') as 'demo' | 'sandbox',
};

export type CodefEnvironment = keyof Omit<
  typeof CODEF_CONFIG,
  'publicKey' | 'environment'
>;

// 현재 환경의 설정 가져오기
export function getCurrentConfig() {
  const env = CODEF_CONFIG.environment;
  const config = CODEF_CONFIG[env];
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    apiUrl: config.apiUrl,
    publicKey: CODEF_CONFIG.publicKey,
  };
}
