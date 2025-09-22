import { frontendAxiosInstance } from './axiosInstance';

// 등기부등본 검색 요청 타입 정의
export interface RealEstateSearchRequest {
  userAddressNickname: string;
  // 2-way 인증 관련 필드
  uniqueNo?: string;
  jobIndex?: number;
  threadIndex?: number;
  jti?: string;
  twoWayTimestamp?: number;
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

// 등기부등본 검색 응답 타입 정의
export interface RealEstateSearchResponse {
  success: boolean;
  message?: string;
  data?: RealEstateJsonData;
  warning?: string;
  resultCode?: string;
  errors?: string[];
  requiresTwoWayAuth?: boolean;
  resAddrList?: RealEstateAddressItem[];
  userAddressNickname?: string;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
}

// 등기부등본 존재 여부 확인 응답 타입 정의
export interface RealEstateExistsResponse {
  success: boolean;
  exists: boolean;
  updatedAt?: Date;
  error?: string;
}

// 등기부등본 복사본 조회 요청 파라미터 타입 정의
export interface RealEstateCopyRequestParams {
  userAddressNickname: string;
}

// 등기부등본 주소 리스트 항목
export interface RealEstateAddressItem {
  resUserNm: string; // 소유자
  commUniqueNo: string; // 부동산 고유번호
  commAddrLotNumber: string; // 부동산 소재지번
  resState: string; // 상태
  resType: string; // 구분
}

// 등기부등본 검색 목록 항목
export interface RealEstateSearchItem {
  resType: string; // 구분 (1:매매목록, 2:공동담보/전세목록)
  resNumber: string; // 순번 (갑(을)구 순위번호)
  commUniqueNo: string; // 부동산 고유번호
  commListNumber: string; // 목록번호
  resListType: string; // 목록종류
}

// 등기부등본 주의사항 항목
export interface RealEstatePrecautionItem {
  resNumber: string; // 순번
  resContents: string; // 내용
}

// 등기부등본 상세내역 항목
export interface RealEstateDetailItem {
  resNumber: string; // 순번
  resContents: string; // 내용
}

// 등기부등본 내용 항목
export interface RealEstateContentItem {
  resNumber: string; // 순번
  resType2: string; // 항목구분(표) (1:제목, 2:내용, 3:공통)
  resDetailList: RealEstateDetailItem[]; // 상세내역 List
}

// 등기부등본 등기사항 요약 항목
export interface RealEstateRegistrationSummaryItem {
  resType: string; // 구분명 (소유지분현황 (갑구)/소유지분을 제외한 소유권에 관한 사항 (갑구)/(근)저당권 및 전세권 등 (을구)/권리변동 예정사항/개별공시지가/토지이용계획)
  resType1: string; // 구분상세
  resContentsList: RealEstateContentItem[]; // 내용List
}

// 등기부등본 등기이력 항목
export interface RealEstateRegistrationHistoryItem {
  resType: string; // 구분명 (표제부/갑구..)
  resType1: string; // 구분상세 (토지의표시/소유권에관한 사항/…)
  resContentsList: RealEstateContentItem[]; // 내용List
}

// 등기부등본 등기사항 항목
export interface RealEstateRegisterEntry {
  resIssueNo: string; // 발급(승인)번호 (YYYYMMDD)
  commUniqueNo: string; // 고유번호
  resDocTitle: string; // 문서제목
  resRealty: string; // 부동산명
  commCompetentRegistryOffice: string; // 관할등기소 (발급인경우 필수)
  resPublishNo: string; // 발행번호 (발급확인번호, "발급"인경우 필수)
  resPublishDate: string; // 발행일자 (발행일 또는 열람일)
  resPublishRegistryOffice: string; // 발행등기소
  resPrecautionsList: RealEstatePrecautionItem[]; // 주의사항 List
  resRegistrationSumList: RealEstateRegistrationSummaryItem[]; // 주요 등기사항 요약 List
  resRegistrationHisList: RealEstateRegistrationHistoryItem[]; // 등기이력List
}

// 등기부등본 JSON 데이터 타입 정의 (RealEstateEntity 기반)
export interface RealEstateJsonData {
  // 인덱스 시그니처 추가
  [key: string]: unknown;

  // 발행 관련
  commIssueCode?: string; // 발행코드 (2025.02 사이트 개편 이후 미제공)
  resIssueYn?: string; // 발행여부 ("0":발행실패(등기사항증명서가 100매 이상일때), "1":발행성공, "2":고유번호조회, "3": 결과처리 실패 (발급성공), "4":발급성공 이후 처리실패 (발급목록에 미발급으로 표시됨))
  resPublishNo?: string; // 발행번호 (발급확인번호, "발급"인경우 필수)
  resPublishDate?: string; // 발행일자 (발행일 또는 열람일)
  resPublishRegistryOffice?: string; // 발행등기소

  // 페이지 관련
  resTotalPageCount?: string; // 총 페이지 수 (inquiryType ="1" (간편검색), 조회실패)
  commStartPageNo?: string; // 시작페이지 번호 (inquiryType="1" (간편검색), 조회실패)
  resEndPageNo?: string; // 종료페이지 번호 (inquiryType="1" (간편검색), 조회실패)

  // 메시지 및 데이터
  resWarningMessage?: string; // 경고 메시지 (warningSkipYN ="1"인 경우 필수)
  resOriginalData?: string; // 원문 DATA (PDF BASE64)

  // 주소 및 검색 정보
  resAddrList?: RealEstateAddressItem[]; // 주소 List (발행여부(resIssueYN)가 0(발행실패) 또는 2(고유번호조회)이면서 다수의 부동산 검색된 경우 조회된 목록)
  resSearchList?: RealEstateSearchItem[]; // 검색 List (발행실패) 매매목록 or 공동담보/전세목록

  // 등기사항 정보
  resRegisterEntriesList?: RealEstateRegisterEntry[]; // 등기사항 List (부동산등기부등본 문서 내용)

  // 추가인증 관련
  continue2Way?: boolean; // 추가 인증 필요 유무 (true : 추가 인증 필요)
  method?: string; // 추가 인증 방식
  jobIndex?: number; // 잡 인덱스
  threadIndex?: number; // 스레드 인덱스
  jti?: string; // 트렌젝션 아이디
  twoWayTimestamp?: number; // 추가 인증 시간

  // 중첩된 데이터 구조
  data?: RealEstateJsonData; // 중첩된 데이터 구조를 위한 재귀적 타입
}

// 등기부등본 복사본 데이터 타입 정의
export interface RealEstateCopyData {
  id: number;
  userAddressId: number;
  realEstateJson: RealEstateJsonData; // 등기부등본 JSON 데이터
  createdAt: string;
  updatedAt: string;
}

// 등기부등본 복사본 생성/수정 요청 파라미터 타입 정의
export interface CreateRealEstateCopyParams {
  userAddressNickname: string;
  realEstateJson: string;
}

// 등기부등본 복사본 API 응답 타입 정의
export interface RealEstateCopyApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: RealEstateCopyData;
  userAddressNickname?: string;
}

/**
 * 등기부등본 API 클래스
 */
class RealEstateApi {
  private static instance: RealEstateApi;

  private constructor() {}

  public static getInstance(): RealEstateApi {
    if (!RealEstateApi.instance) {
      RealEstateApi.instance = new RealEstateApi();
    }
    return RealEstateApi.instance;
  }

  /**
   * 등기부등본 검색 (주소 기반)
   */
  public async searchByAddress(
    data: RealEstateSearchRequest
  ): Promise<RealEstateSearchResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.post(
      '/api/real-estate/search/address',
      data
    );

    return response.data as RealEstateSearchResponse;
  }

  /**
   * 등기부등본 복사본 존재 여부 확인
   */
  public async checkRealEstateCopyExists(
    userAddressNickname: string
  ): Promise<RealEstateExistsResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get(
      `/api/real-estate/exists?userAddressNickname=${encodeURIComponent(userAddressNickname)}`
    );

    return response.data as RealEstateExistsResponse;
  }

  /**
   * 등기부등본 복사본 조회
   */
  public async getRealEstateCopy(
    userAddressNickname: string
  ): Promise<RealEstateCopyApiResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get(
      `/api/real-estate/copies?userAddressNickname=${encodeURIComponent(userAddressNickname)}`
    );

    return response.data as RealEstateCopyApiResponse;
  }
}

export const realEstateApi = RealEstateApi.getInstance();
export default realEstateApi;
