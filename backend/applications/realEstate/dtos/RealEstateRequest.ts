/**
 * 등기부등본 조회 API 요청 DTO
 */

export interface Identity {
  reqIdentity: string; // 주민등록번호[13자리]
}

// 전체 요청 공통 필드
export interface BaseRealEstateRequest {
  organization: string; // 기관코드 (부동산등기부등본 서비스 기관)
  phoneNo: string; // 전화번호
  password: string; // 비밀번호 => RSA 암호화 필요, 4자리 숫자로 사용자 임의 설정(재열람 시 사용)
  inquiryType: string; // 조회 구분
  userAddressId: number; // 사용자 주소 ID (DB 저장용)
  userAddressNickname?: string; // 사용자 주소 닉네임
  joinMortgageJeonseYN?: string; // 공동담보/전세 목록 포함 여부[0: 미포함, 1: 포함, default='0']
  tradingYN?: string; // 매매목록 포함 여부[0: 미포함, 1: 포함, default='0']
  listNumber?: string; // 목록 번호[default: 목록전체, 다건 선택 시 '|'로 구분 ex. '2007123|2017134']
  electronicClosedYN?: string; // 전산폐쇠조회 여부[0: 미포함, 1: 포함, default='0']
  ePrepayNo?: string; // 선불전자지급수단 번호(12자리)[issueType < 2인 경우 필수]
  ePrepayPass?: string; // 선불전자지급수단 비밀번호 [issueType < 2인 경우 필수]
  issueType: string; // 발행구분['0': 발급, '1': 열람, '2': 고유번호조회, '3': 원문데이터로 결과 처리, default: '0']
  originDataYN?: string; // 원문Data 포함 여부[0: 미포함, 1: 포함, default: 0]
  warningSkipYN?: string; // 경고 무시 여부[0: 실행 취소, 1: 무시(실행 진행), default: 0]
  registerSummaryYN?: string; // 등기사항 요약 출력 여부[0: 미출력, 1: 출력, default: 0]
  selectAddress?: string; // 주소 리스트 선택 여부[0: 미선택, 1: 선택, default: 0]
  isIdentityViewYn?: string; // 주민등록번호 공개 여부[0: 미공개, 1: 특정인공개, default: 0]
  identityList?: Identity[]; // 주민등록번호 List[isIdentityViewYn='1'인 경우 필수]
}

// 고유 번호로 검색
export interface SummaryInquiryRequest extends BaseRealEstateRequest {
  inquiryType: '0';
  uniqueNo: string; // 부동산 고유 번호(고유 번호 찾기 일 때만)
}

// 간편 검색
export interface DetailInquiryRequest extends BaseRealEstateRequest {
  inquiryType: '1';
  realtyType?: string; // 부동산 구분[0 : 토지 + 건물(inquiryType='1'은 불가) 1: 집합건물 2: 토지 3: 건물]
  addr_sido: string; // 주소 시/도[inquiryType='1'인 경우 미입력 시 전체]
  address: string; // 주소(inquiryType='1', 검색어는 최소 3자리)
  recordStatus?: string; // 등기 기록 상태[0: 현행, 1: 폐쇄, 2: 현행+폐쇄, default='0']
  dong: string; // 동;
  ho: string; // 호
  startPageNo?: string; // 시작 페이지 번호[미입력 시 첫 페이지]
  pageCount?: string; // 조회 페이지 수[default=100]
  applicationType?: string; // 검색 결과에서[0: 전유 제외, 1: 전유 포함, default='0']
}

// 소재 지번으로 찾기
export interface IssueRequest extends BaseRealEstateRequest {
  inquiryType: '2';
  realtyType?: string; // 부동산 구분[0 : 토지 + 건물(inquiryType='1'은 불가) 1: 집합건물 2: 토지 3: 건물]
  addr_sido: string; // 주소 시/도[inquiryType='1'인 경우 미입력 시 전체]
  addr_dong: string; // 주소_읍면동로
  addr_lotNumber: string; // 주소_지번
  inputSelect?: string; // 입력 선택(realtyType='1'(집합건물)인 경우 필수)[0: 지번, 1: 건물 명칭]
}

// 도로명 주소로 찾기
export interface IssueResultRequest extends BaseRealEstateRequest {
  inquiryType: '3';
  realtyType?: string; // 부동산 구분[0 : 토지 + 건물(inquiryType='1'은 불가) 1: 집합건물 2: 토지 3: 건물]
  addr_sido: string; // 주소 시/도[inquiryType='1'인 경우 미입력 시 전체]
  addr_sigungu: string; // 주소_시군구
  addr_roadName: string; // 주소_도로명
  dong: string;
  ho: string;
  addr_buildingNumber: string; // 주소_건물번호(도로명)
  electronicClosedYN?: string; // 전산폐쇠조회 여부[0: 미포함, 1: 포함, default='0']
  originData: string; // 원문 Data
}

// 통합 요청 타입 (union type)
export type GetRealEstateRequest =
  | SummaryInquiryRequest
  | DetailInquiryRequest
  | IssueRequest
  | IssueResultRequest;