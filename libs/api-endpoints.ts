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

// 실거래가 API 엔드포인트 설정
export const REAL_ESTATE_TRANSACTION_API_CONFIG = {
  // 기본 URL (매매 실거래가)
  BASE_URL: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade',
  
  // 서비스키 환경변수명
  SERVICE_KEY_ENV: 'RTMSDATA_TRANSACTION_PRICE_KEY',
  
  // 엔드포인트들
  ENDPOINTS: {
    // 아파트 매매 실거래가
    APARTMENT_TRADE: '/getRTMSDataSvcAptTrade',
    // 연립다세대 매매 실거래가
    ROW_HOUSE_TRADE: '/getRTMSDataSvcRHTrade',
    // 단독/다가구 매매 실거래가
    DETACHED_HOUSE_TRADE: '/getRTMSDataSvcSHTrade',
    // 오피스텔 매매 실거래가
    OFFICETEL_TRADE: '/getRTMSDataSvcOffiTrade',
    // // 단독/다가구 전월세 실거래가
    // DETACHED_HOUSE_RENT: '/getRTMSDataSvcSHRent',
    // // 오피스텔 전월세 실거래가
    // OFFICETEL_RENT: '/getRTMSDataSvcORTRent',
  },
  
  // 전체 URL들
  get APARTMENT_TRADE_FULL_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.APARTMENT_TRADE}`;
  },
  
  get ROW_HOUSE_TRADE_FULL_URL() {
    return `https://apis.data.go.kr/1613000/RTMSDataSvcRHTrade${this.ENDPOINTS.ROW_HOUSE_TRADE}`;
  },
  
  get DETACHED_HOUSE_TRADE_FULL_URL() {
    return `https://apis.data.go.kr/1613000/RTMSDataSvcSHTrade${this.ENDPOINTS.DETACHED_HOUSE_TRADE}`;
  },
  
  get OFFICETEL_TRADE_FULL_URL() {
    return `https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade${this.ENDPOINTS.OFFICETEL_TRADE}`;
  },
  
  // get DETACHED_HOUSE_RENT_FULL_URL() {
  //   return `${this.BASE_URL}${this.ENDPOINTS.DETACHED_HOUSE_RENT}`;
  // },
  
  // get OFFICETEL_RENT_FULL_URL() {
  //   return `${this.BASE_URL}${this.ENDPOINTS.OFFICETEL_RENT}`;
  // },
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 내부 API 엔드포인트 (Next.js API Routes)
  TAX_CERT: '/api/tax-cert',
  TRANSACTION_APARTMENT: '/api/transaction/apartment',
  TRANSACTION_ROW_HOUSE: '/api/transaction/row-house',
  TRANSACTION_DETACHED_HOUSE: '/api/transaction/detached-house',
  TRANSACTION_OFFICETEL: '/api/transaction/officetel',

  // 외부 API 엔드포인트 (CODEF)
  CODEF_TAX_CERT: CODEF_API_CONFIG.TAX_CERT_FULL_URL,
  
  // 외부 API 엔드포인트 (실거래가)
  REAL_ESTATE_APARTMENT_TRADE: REAL_ESTATE_TRANSACTION_API_CONFIG.APARTMENT_TRADE_FULL_URL,
  REAL_ESTATE_ROW_HOUSE_TRADE: REAL_ESTATE_TRANSACTION_API_CONFIG.ROW_HOUSE_TRADE_FULL_URL,
  REAL_ESTATE_DETACHED_HOUSE_TRADE: REAL_ESTATE_TRANSACTION_API_CONFIG.DETACHED_HOUSE_TRADE_FULL_URL,
  REAL_ESTATE_OFFICETEL_TRADE: REAL_ESTATE_TRANSACTION_API_CONFIG.OFFICETEL_TRADE_FULL_URL,
  // REAL_ESTATE_DETACHED_HOUSE_RENT: REAL_ESTATE_TRANSACTION_API_CONFIG.DETACHED_HOUSE_RENT_FULL_URL,
  // REAL_ESTATE_OFFICETEL_RENT: REAL_ESTATE_TRANSACTION_API_CONFIG.OFFICETEL_RENT_FULL_URL,
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
