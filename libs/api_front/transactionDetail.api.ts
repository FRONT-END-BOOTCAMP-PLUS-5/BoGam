import { frontendAxiosInstance } from './axiosInstance';

// 실거래가 상세조회 API 요청 파라미터 타입 정의
export interface TransactionDetailRequestParams {
  organization: string; // 고정값: "0010"
  type: string; // "0": 아파트, "1": 연립/다세대, "2": 오피스텔
  contractYear: string; // YYYY (2006년부터)
  contractType: string; // "0":전체, "1":매매, "2":전월세 (default: 0)

  // Apart 전용 필드
  buildingCode?: string; // 단지일련번호 조회 API 결과값 (category가 'apart'일 때 필수)

  // Single 전용 필드
  addrSido?: string; // 주소_시도 (category가 'single'일 때 필수)
  addrSigungu?: string; // 주소_시군구 (category가 'single'일 때 필수)
  addrDong?: string; // 주소_읍면동 (category가 'single'일 때 필수)
}

// 실거래가 상세 데이터 타입 정의 (아파트 계열 - 매매)
export interface TransactionDetailApartSaleItem {
  resYear: string; // 년도
  resMonth: string; // 월
  resDays: string; // 일
  resArea: string; // 면적
  resTranAmount: string; // 거래금액
  resFloor: string; // 층
  resArea1?: string; // 면적1
  resCancelYN?: string; // 취소여부
  resRegistrationDate?: string; // 등록일
  resDealType?: string; // 거래유형
  resLocation?: string; // 위치
  resFloorNum?: string; // 층수
  resDong?: string; // 동
}

// 실거래가 상세 데이터 타입 정의 (아파트 계열 - 전월세)
export interface TransactionDetailApartRentItem {
  resYear: string; // 년도
  resMonth: string; // 월
  resDays: string; // 일
  resArea: string; // 면적
  resTranAmount: string; // 거래금액 (전월세의 경우 보통 0 또는 빈 값)
  resFloor: string; // 층
  resArea1?: string; // 면적1
  resCancelYN?: string; // 취소여부
  resRegistrationDate?: string; // 등록일
  resDealType?: string; // 거래유형
  resLocation?: string; // 위치
  resFloorNum?: string; // 층수
  resDong?: string; // 동

  // 전월세 전용 필드들
  commStartDate?: string; // 계약시작일자 (YYMM)
  commEndDate?: string; // 계약종료일자 (YYMM)
  resDeposit?: string; // 보증금 (단위: 만원)
  resMonthlyRent?: string; // 월세 (단위: 만원)
  resContractType?: string; // 계약구분 (ex. "갱신")
  resRenewalUse?: string; // 갱신요구권사용 (ex. "사용")
  resPrevDeposit?: string; // 종전계약보증금 (단위: 만원)
  resPrevMonthlyRent?: string; // 종전계약월세 (단위: 만원)
  resDesignationYN?: string; // 지역지구등 지정여부
  resRoadCondition?: string; // 도로조건
  resLandMoveDate?: string; // 토지이동일
  resLandMoveReason?: string; // 토지이동사유
  resMinBLR?: string; // 최저 건폐율 (단위: %)
  resMaxBLR?: string; // 최고 건폐율 (단위: %)
  resMinFAR?: string; // 최저 용적율 (단위: %)
  resMaxFAR?: string; // 최고 용적율 (단위: %)
  resStructure?: string; // 주구조 (ex. "철근콘크리트조")
  resBuildYear?: string; // 건축년도
}

// 실거래가 상세 API 응답 타입 정의
export interface TransactionDetailApiResponse {
  success: boolean;
  data: {
    data?: {
      resSaleList?: TransactionDetailApartSaleItem[];
      resRentList?: TransactionDetailApartRentItem[];
    };
    resSaleList?: TransactionDetailApartSaleItem[];
    resRentList?: TransactionDetailApartRentItem[];
  };
  message?: string;
  hasData?: boolean;
}

/**
 * 실거래가 상세조회 API 클래스
 */
class TransactionDetailApi {
  private static instance: TransactionDetailApi;

  private constructor() {}

  public static getInstance(): TransactionDetailApi {
    if (!TransactionDetailApi.instance) {
      TransactionDetailApi.instance = new TransactionDetailApi();
    }
    return TransactionDetailApi.instance;
  }

  /**
   * 아파트 계열 실거래가 상세조회
   */
  public async getTransactionDetailApart(
    params: TransactionDetailRequestParams
  ): Promise<TransactionDetailApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<TransactionDetailApiResponse>(
      '/api/transaction-details?category=apart',
      params
    );
    return response.data;
  }

  /**
   * 단독/다가구 실거래가 상세조회
   */
  public async getTransactionDetailSingle(
    params: TransactionDetailRequestParams
  ): Promise<TransactionDetailApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<TransactionDetailApiResponse>(
      '/api/transaction-details?category=single',
      params,
      {
        timeout: 120000, // 120초 (2분)
      }
    );

    return response.data;
  }
}

export const transactionDetailApi = TransactionDetailApi.getInstance();
export default transactionDetailApi;
