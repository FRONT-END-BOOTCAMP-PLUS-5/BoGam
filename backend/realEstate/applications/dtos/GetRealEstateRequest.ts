// 부동산등기부등본 조회 요청 DTO

// 신원정보 인터페이스
export interface Identity {
  reqIdentity: string; // 주민등록번호 13자리
}

// 기본 부동산 요청 인터페이스
export interface BaseRealEstateRequest {
  organization: string; // 기관코드 (고정값: "0002")
  phoneNo: string; // 전화번호
  password: string; // RSA 암호화된 비밀번호 (4자리 숫자)
  inquiryType: '0' | '1' | '2' | '3'; // 조회구분
  issueType: string; // 발행구분 ('0':발급, '1':열람, '2':고유번호조회)
  
  // 공통 선택적 필드들
  jointMortgageJeonseYN?: string; // 공동담보/전세목록 포함여부
  tradingYN?: string; // 매매목록 포함여부
  listNumber?: string; // 목록번호
  electronicClosedYN?: string; // 전산폐쇠조회 여부
  ePrepayNo?: string; // 선불전자지급수단 번호
  ePrepayPass?: string; // 선불전자지급수단 비밀번호
  originDataYN?: string; // 원문Data 포함 여부
  warningSkipYN?: string; // 경고 무시 여부
  registerSummaryYN?: string; // 등기사항요약 출력 여부
  selectAddress?: string; // 주소 리스트 선택 여부
  isIdentityViewYn?: string; // 주민등록번호 공개여부
  identityList?: Identity[]; // 주민등록번호 List
}

// 고유번호 조회 요청 (inquiryType: '0')
export interface SummaryInquiryRequest extends BaseRealEstateRequest {
  inquiryType: '0';
  uniqueNo: string; // 부동산 고유번호 (14자리)
}

// 간편검색 요청 (inquiryType: '1')
export interface DetailInquiryRequest extends BaseRealEstateRequest {
  inquiryType: '1';
  address: string; // 주소 검색어 (최소 3자리)
  addr_sido?: string; // 시/도
  recordStatus?: string; // 등기기록상태
  realtyType?: string; // 부동산 구분
  startPageNo?: string; // 시작페이지번호
  pageCount?: string; // 조회페이지수
  dong?: string; // 동
  ho?: string; // 호
  applicationType?: string; // 신청구분
}

// 소재지번 조회 요청 (inquiryType: '2')
export interface LotNumberInquiryRequest extends BaseRealEstateRequest {
  inquiryType: '2';
  addr_sido?: string; // 시/도
  addr_sigungu?: string; // 시/군/구
  addr_dong?: string; // 읍/면/동
  addr_lotNumber?: string; // 지번
  realtyType?: string; // 부동산 구분
  inputSelect?: string; // 입력선택 (0:지번, 1:건물명칭)
  buildingName?: string; // 건물명칭
  dong?: string; // 동
  ho?: string; // 호
}

// 도로명주소 조회 요청 (inquiryType: '3')  
export interface IssueResultRequest extends BaseRealEstateRequest {
  inquiryType: '3';
  addr_sido?: string; // 시/도
  addr_sigungu?: string; // 시/군/구
  addr_roadName: string; // 도로명 (필수)
  addr_buildingNumber: string; // 건물번호 (필수)
  realtyType?: string; // 부동산 구분
  dong?: string; // 동
  ho?: string; // 호
  originData?: string; // 원문Data
}

// 통합 요청 타입
export type GetRealEstateRequest = 
  | SummaryInquiryRequest 
  | DetailInquiryRequest 
  | LotNumberInquiryRequest 
  | IssueResultRequest;