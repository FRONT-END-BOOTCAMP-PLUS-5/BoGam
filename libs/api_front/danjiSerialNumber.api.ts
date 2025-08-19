import { frontendAxiosInstance } from './axiosInstance';

// 단지 일련번호 조회 API 요청 파라미터 타입 정의
export interface DanjiSerialNumberRequestParams {
  organization: '0010'; // 기관코드 (고정 값: "0010")
  year: string; // 기준년도 (YYYY)
  type: string; // 구분 ("0":아파트, "1":연립/다세대, "2":오피스텔)
  searchGbn: string; // 조회구분 ("0":지번주소, "1":도로명주소)
  addrSido: string; // 주소_시도
  addrSigungu: string; // 주소_시군구
  addrDong: string; // 주소_읍면동로 (지번주소인 경우 읍면동명, 도로명주소인경우 도로명주소 입력)
  complexName?: string; // 단지명 (선택사항)
}

// 단지 정보 타입 정의
export interface DanjiInfo {
  danjiCode: string; // 단지코드
  danjiName: string; // 단지명
  address: string; // 주소
  constructionCompany: string; // 건설사
  completionDate: string; // 준공일
  totalHouseholds: number; // 총세대수
  serialNumber: string; // 일련번호
  commBuildingCode: string; // 건물코드 (실거래가 조회 API 입력값으로 사용)
  resBuildingName: string; // 건물명칭
  commAddrLotNumber: string; // 지번
  resBunji: string; // 번지
  commAddrRoadName: string; // 도로명
}

// 단지 일련번호 API 응답 타입 정의
export interface DanjiSerialNumberApiResponse {
  success: boolean;
  data: {
    danjiList: DanjiInfo[];
  };
  message?: string;
}

/**
 * 단지 일련번호 API 클래스
 */
class DanjiSerialNumberApi {
  private static instance: DanjiSerialNumberApi;

  private constructor() {}

  public static getInstance(): DanjiSerialNumberApi {
    if (!DanjiSerialNumberApi.instance) {
      DanjiSerialNumberApi.instance = new DanjiSerialNumberApi();
    }
    return DanjiSerialNumberApi.instance;
  }

  /**
   * 단지 일련번호 조회
   */
  public async getDanjiSerialNumber(
    params: DanjiSerialNumberRequestParams
  ): Promise<DanjiSerialNumberApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post<DanjiSerialNumberApiResponse>(
      '/api/danji-serial-numbers',
      params,
      {
        timeout: 120000, // 120초 (2분)
      }
    );

    return response.data;
  }
}

export const danjiSerialNumberApi = DanjiSerialNumberApi.getInstance();
export default danjiSerialNumberApi;
