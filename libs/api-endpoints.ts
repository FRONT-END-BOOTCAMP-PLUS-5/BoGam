// CODEF API 엔드포인트 설정
export const CODEF_API_CONFIG = {
  // 기본 URL
  BASE_URL: 'https://development.codef.io',

  // 납세증명서 발급 API 엔드포인트
  TAX_CERT_ENDPOINT: '/v1/kr/public/nt/proof-issue/tax-cert-all',
  DANJI_ENDPOINT: '/v1/kr/public/lt/real-estate-board/estate-list',
  SISE_ENDPOINT: '/v1/kr/public/lt/real-estate-board/market-price-information',
  HOUSING_PRICE_ENDPOINT: '/v1/kr/public/lt/kras-real-estate/housing-price',
  REB_HOUSING_PRICE_ENDPOINT: '/v1/kr/public/lt/reb-real-estate/housing-price',

  // 전체 URL (BASE_URL + ENDPOINT)
  get TAX_CERT_FULL_URL() {
    return `${this.BASE_URL}${this.TAX_CERT_ENDPOINT}`;
  },

  get DANJI_FULL_URL() {
    return `${this.BASE_URL}${this.DANJI_ENDPOINT}`;
  },

  get SISE_FULL_URL() {
    return `${this.BASE_URL}${this.SISE_ENDPOINT}`;
  },

  get HOUSING_PRICE_FULL_URL() {
    return `${this.BASE_URL}${this.HOUSING_PRICE_ENDPOINT}`;
  },

  get REB_HOUSING_PRICE_FULL_URL() {
    return `${this.BASE_URL}${this.REB_HOUSING_PRICE_ENDPOINT}`;
  },
};

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 내부 API 엔드포인트 (Next.js API Routes)
  TAX_CERT: '/api/tax-cert',

  // 외부 API 엔드포인트 (CODEF)
  CODEF_TAX_CERT: CODEF_API_CONFIG.TAX_CERT_FULL_URL,
} as const;

// API 환경별 설정
export const API_ENVIRONMENTS = {
  DEVELOPMENT: {
    BASE_URL: 'https://development.codef.io',
    TAX_CERT_ENDPOINT: '/v1/kr/public/nt/proof-issue/tax-cert-all',
  },
  PRODUCTION: {
    BASE_URL: 'https://api.codef.io',
    TAX_CERT_ENDPOINT: '/v1/kr/public/nt/proof-issue/tax-cert-all',
  },
} as const;
