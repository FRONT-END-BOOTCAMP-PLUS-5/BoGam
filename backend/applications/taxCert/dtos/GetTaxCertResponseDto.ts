/**
 * 납세증명서 조회 응답 DTO
 */

// 세부 응답 데이터 타입
export interface TaxCertRespiteItem {
  resRespiteType?: string; // 유예종류
  resRespitePeriod?: string; // 유예기간
  resTaxYear?: string; // 과세년도 (과세기간)
  resTaxItemName?: string; // 세목
  resPaymentDeadline?: string; // 납부기한
  resLocalTaxAmt?: string; // 지방세액 (세액)
  resAdditionalCharges?: string; // 가산금
}

export interface TaxCertArrearsItem {
  resUserNm?: string; // 성명 (위탁자)
  resTaxYear?: string; // 과세년도 (과세기간)
  resTaxItemName?: string; // 세목
  resPaymentDeadline?: string; // 납부기한
  resLocalTaxAmt?: string; // 지방세액 (세액)
  resAdditionalCharges?: string; // 가산금
}

// 응답 데이터 상세 타입 정의
export interface TaxCertResponseData {
  resIssueNo?: string; // 발급번호
  resUserNm?: string; // 성명(대표자)
  resUserAddr?: string; // 주소(본점)
  resUserIdentiyNo?: string; // 주민등록번호 (법인의 경우 "법인등록번호")
  resCompanyNm?: string; // 상호(법인명) (법인의 경우 필수)
  resCompanyIdentityNo?: string; // 사업자등록번호 (법인의 경우 필수)
  resPaymentTaxStatusCd?: string; // 납세상태코드 (예: "ZZ")
  resPaymentTaxStatus?: string; // 납세상태 (예: "해당없음")
  resUsePurpose?: string; // 증명서 사용목적
  resOriGinalData?: string; // 원문 DATA (XML 원문, originDataYN="1"인 경우 포함)
  resOriGinalData1?: string; // 원문 DATA1 (PDF 파일 Base64 값, originDataYN1="1"인 경우 포함)
  resValidPeriod?: string; // 유효기간 (증명서 유효기간)
  resReason?: string; // 사유 (유효기간을 정한 사유)
  resReceiptNo?: string; // 접수번호
  resDepartmentName?: string; // 부서명 (담당부서)
  resUserNm1?: string; // 성명1 (담당자)
  resPhoneNo?: string; // 전화번호 (연락처)
  resIssueOgzNm?: string; // 발급기관
  resIssueDate?: string; // 발급일자 (YYYYMMDD)
  resRespiteList?: TaxCertRespiteItem[]; // 징수유예등 또는 체납처분유예의 명세 List
  resArrearsList?: TaxCertArrearsItem[]; // 체납 List (물적납세의무 체납내역 List)
  // 추가인증 관련 필드들
  continue2Way?: boolean; // 추가 인증 필요 유무 (true: 추가 인증 필요)
  method?: string; // 추가 인증 방식
  jobIndex?: number; // 잡 인덱스 (추가 인증 정보)
  threadIndex?: number; // 스레드 인덱스 (추가 인증 정보)
  jti?: string; // 트랜잭션 아이디 (추가 인증 정보)
  twoWayTimestamp?: number; // 추가 인증 시간
  // 간편인증 관련 필드들
  simpleKeyToken?: string; // 간편인증 토큰
  rValue?: string; // 검증 값 (Base64 url-safe 인코딩)
  certificate?: string; // 전자서명을 수행한 인증서
  extraInfo?: {
    commSimpleAuth?: string; // 간편인증
    reqPlainTexts?: string; // 전자서명 원문 (BASE64 TYPE)
    reqSignType?: string; // 전자서명 방식 ("0":CMS(PKCS7), "1":PKCS1)
    reqSignAlg?: string; // 전자서명 알고리즘 ("0":RSASSA-PKCS1-v1_5_SHA256, "1":RSASSA-PSS_SHA256_MGF_SHA256)
    reqCMSssn?: string; // 전자서명 CMS_ssn (reqSignType="0" 필수, "dummy"값 고정)
    reqCMStime?: string; // 전자서명 CMS_time (reqSignType="0" 필수)
    reqCMSwithoutContent?: string; // 전자서명 CMS_withoutContent (reqSignType="0" 필수, "0":false, "1":true)
    reqPKCS1IncludeR?: string; // 전자서명 PKCS1_IncludeR (reqSignType="1" 필수, "0":false, "1":true)
    reqSignedData?: string; // 전자서명 (certType="2"만 사용)
    simpleKeyToken?: string; // 간편인증 토큰
    rValue?: string; // 검증 값
    certificate?: string; // 전자서명을 수행한 인증서
  };
}

// 중첩된 응답 구조를 위한 타입 (실제 CODEF API 응답 구조)
export interface NestedTaxCertResponseData {
  data?: TaxCertResponseData; // 중첩된 데이터 구조
  // 다른 가능한 필드들 (필요시 추가)
  success?: boolean;
  message?: string;
  timestamp?: number;
}

// CODEF API 응답 구조
export interface CodefResponse {
  result: {
    code: string; // 결과 코드
    message: string; // 결과 메시지
    extraMessage?: string; // 추가 메시지
    transactionId?: string; // 트랜잭션 ID
  };
  data?: TaxCertResponseData | NestedTaxCertResponseData; // 응답 데이터 (단일 또는 중첩 구조)
}

// Application Layer 응답 DTO
export interface GetTaxCertResponseDto {
  success: boolean; // 요청 성공 여부
  message?: string; // 응답 메시지
  data?: CodefResponse; // API 응답 데이터
  error?: string; // 오류 메시지
  duration?: number; // 요청 처리 시간 (ms)
}
