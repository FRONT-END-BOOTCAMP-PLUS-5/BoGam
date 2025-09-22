import { frontendAxiosInstance } from './axiosInstance';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

// 납세증명서 발급 요청 타입 정의
export interface TaxCertIssueRequest {
  organization: string; // 기관코드
  loginType: string; // 로그인 구분
  isIdentityViewYN: string; // 주민등록번호 공개 여부
  proofType: string; // 증명구분
  submitTargets: string; // 제출처
  userAddressNickname: string; // 사용자 주소 닉네임
  is2Way?: boolean; // 2단계 인증 여부
  certType?: string; // 인증서 구분
  certFile?: string; // 인증서 파일
  keyFile?: string; // 키 파일
  certPassword?: string; // 인증서 비밀번호
  userId?: string; // 아이디
  userPassword?: string; // 비밀번호
  userName?: string; // 사용자 이름
  loginIdentity?: string; // 사용자 주민번호
  loginTypeLevel?: string; // 간편인증 로그인 구분
  phoneNo?: string; // 전화번호
  telecom?: string; // 통신사
  // 추가 필드들
  isAddrViewYn?: string;
  applicationType?: string;
  clientTypeLevel?: string;
  id?: string;
  loginBirthDate?: string;
  manageNo?: string;
  managePassword?: string;
  identity?: string;
  birthDate?: string;
  originDataYN?: string;
  originDataYN1?: string;
  identityEncYn?: string;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
  simpleAuth?: string;
  signedData?: {
    certSeqNum?: string;
    signedVals?: string[];
    hashedVals?: string[];
    hashAlgorithm?: string;
  };
  simpleKeyToken?: string;
  rValue?: string;
  certificate?: string;
  extraInfo?: Record<string, unknown>;
}

// 납세증명서 API 응답 타입 정의
export interface TaxCertApiResponse {
  success: boolean;
  message: string;
  data?: CodefResponse;
  warning?: string;
  resultCode?: string;
  errors?: string[];
}

// 납세증명서 존재 여부 확인 응답 타입 정의
export interface TaxCertExistsResponse {
  success: boolean;
  exists: boolean;
  error?: string;
}

// 납세증명서 복사본 조회 요청 파라미터 타입 정의
export interface TaxCertCopyRequestParams {
  userAddressNickname: string;
}

// 납세증명서 JSON 데이터 타입 정의
export interface TaxCertJsonData {
  [key: string]: string | number | boolean | null | undefined;
}

// 납세증명서 복사본 데이터 타입 정의
export interface TaxCertCopyData {
  id: number;
  userAddressId: number;
  taxCertJson: TaxCertJsonData; // 납세증명서 JSON 데이터
  createdAt: string;
  updatedAt: string;
}

// 납세증명서 복사본 API 응답 타입 정의
export interface TaxCertCopyApiResponse {
  success: boolean;
  message: string;
  data?: TaxCertCopyData;
}

/**
 * 납세증명서 API 클래스
 */
class TaxCertApi {
  private static instance: TaxCertApi;

  private constructor() {}

  public static getInstance(): TaxCertApi {
    if (!TaxCertApi.instance) {
      TaxCertApi.instance = new TaxCertApi();
    }
    return TaxCertApi.instance;
  }

  /**
   * 납세증명서 발급 요청
   */
  public async issueTaxCert(
    issueData: TaxCertIssueRequest
  ): Promise<TaxCertApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post(
      '/api/tax-cert',
      issueData
    );

    return response.data as TaxCertApiResponse;
  }

  /**
   * 납세증명서 존재 여부 확인
   */
  public async checkTaxCertExists(
    userAddressNickname: string
  ): Promise<TaxCertExistsResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get(
      `/api/tax-cert/exists?userAddressNickname=${encodeURIComponent(userAddressNickname)}`
    );

    return response.data as TaxCertExistsResponse;
  }


  /**
   * 납세증명서 복사본 조회
   */
  public async getTaxCertCopy(
    params: TaxCertCopyRequestParams
  ): Promise<TaxCertCopyApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();
    
    const response = await axiosInstance.get(
      `/api/tax-cert/copies?userAddressNickname=${encodeURIComponent(params.userAddressNickname)}`
    );

    return response.data as TaxCertCopyApiResponse;
  }
}

export const taxCertApi = TaxCertApi.getInstance();
export default taxCertApi;
