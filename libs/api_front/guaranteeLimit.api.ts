import { frontendAxiosInstance } from './axiosInstance';

// 요청 DTO 타입
export interface GetGuaranteeLimitRequestDto {
  rentGrntAmt: number; // 전세보증금
  trgtLwdgCd: string; // 대상지역코드
  age: number; // 나이
  weddStcd: string; // 결혼상태코드
  myIncmAmt: number; // 내 소득금액
  myTotDebtAmt: number; // 내 총부채금액
  ownHsCnt: number; // 보유주택수
  mmrtAmt: number; // 월세금액
  numOfRows: number; // 페이지 당 행 수
  pageNo: number; // 페이지 번호
  userAddressNickname?: string; // 사용자 주소 닉네임 (DB 저장용)
}

// 응답 DTO 타입
export interface GetGuaranteeLimitResponseDto {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  totalCount: number;
  numOfRows: number;
  pageNo: number;
  items: Array<{
    grntDvcd: string; // 보증구분코드
    grntLmtAmt: string; // 보증한도금액
    loanLmtAmt: string; // 대출한도금액
    rcmdProrRnk: number; // 추천순위
  }>;
}

// API 응답 타입 (DB 저장 포함)
export interface GuaranteeLimitApiResponse {
  success: boolean;
  message?: string;
  data?: GetGuaranteeLimitResponseDto;
  warning?: string;
  error?: string;
}

// 보증한도 복사본 조회 요청 파라미터 타입 정의
export interface GuaranteeLimitCopyRequestParams {
  userAddressNickname: string;
}

// 보증한도 JSON 데이터 타입 정의
export interface GuaranteeLimitJsonData {
  [key: string]: string | number | boolean | null | undefined;
}

// 보증한도 복사본 데이터 타입 정의
export interface GuaranteeLimitCopyData {
  id: number;
  userAddressId: number;
  guaranteeLimitJson: GuaranteeLimitJsonData; // 보증한도 JSON 데이터
  createdAt: string;
  updatedAt: string;
}

// 보증한도 복사본 존재 여부 확인 응답 타입 정의
export interface GuaranteeLimitCopyExistsResponse {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  error?: string;
}


// 보증한도 복사본 API 응답 타입 정의
export interface GuaranteeLimitCopyApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: GuaranteeLimitCopyData;
}

// API 함수
export const getGuaranteeLimit = async (
  data: GetGuaranteeLimitRequestDto
): Promise<GuaranteeLimitApiResponse> => {
  console.log('data', data);
  const response = await frontendAxiosInstance
    .getAxiosInstance()
    .post('/api/guarantee-limit', data);
  return response.data as GuaranteeLimitApiResponse;
};

/**
 * 보증한도 복사본 API 클래스
 */
class GuaranteeLimitCopyApi {
  private static instance: GuaranteeLimitCopyApi;

  private constructor() {}

  public static getInstance(): GuaranteeLimitCopyApi {
    if (!GuaranteeLimitCopyApi.instance) {
      GuaranteeLimitCopyApi.instance = new GuaranteeLimitCopyApi();
    }
    return GuaranteeLimitCopyApi.instance;
  }

  /**
   * 보증한도 복사본 존재 여부 확인
   */
  public async checkGuaranteeLimitCopyExists(
    userAddressNickname: string
  ): Promise<GuaranteeLimitCopyExistsResponse> {
    try {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get(`/api/guarantee-limit/exists?userAddressNickname=${encodeURIComponent(userAddressNickname)}`);
      return response.data as GuaranteeLimitCopyExistsResponse;
    } catch (error) {
      console.error('보증한도 복사본 존재 여부 확인 오류:', error);
      throw error;
    }
  }

  /**
   * 보증한도 복사본 조회
   */
  public async getGuaranteeLimitCopy(
    params: GuaranteeLimitCopyRequestParams
  ): Promise<GuaranteeLimitCopyApiResponse> {
    try {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get('/api/guarantee-limit/copies', {
          params: { userAddressNickname: params.userAddressNickname },
        });
      return response.data as GuaranteeLimitCopyApiResponse;
    } catch (error) {
      console.error('보증한도 복사본 조회 오류:', error);
      throw error;
    }
  }

}

export const guaranteeLimitCopyApi = GuaranteeLimitCopyApi.getInstance();
export default guaranteeLimitCopyApi;
