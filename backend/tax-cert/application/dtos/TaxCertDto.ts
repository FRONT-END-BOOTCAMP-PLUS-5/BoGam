// TaxCertRequest와 TaxCertTwoWayRequest 타입 정의
export interface TaxCertRequest {
  organization: string; // 기관코드 (고정값: "0001")
  loginType: string; // 로그인 구분 ("0":회원인증서, "1":회원아이디, "2":비회원인증서, "5":회원간편인증, "6":비회원간편인증)
  isIdentityViewYN: string; // 주민번호 뒷자리 공개여부 ("1":공개, "0":비공개)
  isAddrViewYn?: string; // 주소 공개여부 ("1":공개, "0":비공개)
  proofType: string; // 증명구분 ("B0006":대금수령, "B0007":기타)
  submitTargets: string; // 제출처 ("01":금융기관, "02":관공서, "03":조합/협회, "04":거래처, "05":학교, "99":기타)
  applicationType?: string; // 신청 구분 ("01":본인, "02":세무대리인)
  clientTypeLevel?: string; // 의뢰인 구분 ("1":개인, "2":개인단체, "3":사업자)
  id?: string; // 요청 식별 아이디 (SSO 구분값)
  userName?: string; // 사용자 이름 (loginType="2,5,6" 필수)
  loginIdentity?: string; // 사용자 주민번호 (loginType="2,5,6" 필수)
  loginBirthDate?: string; // 생년월일 (yymmdd, identityEncYn="Y"인 경우 필수)
  phoneNo?: string; // 전화번호 (loginType="5,6" 필수)
  loginTypeLevel?: string; // 간편인증 로그인 구분 ("1":카카오톡, "2":페이코, "3":삼성패스, "4":KB모바일인증서, "5":통신사인증서, "6":네이버, "7":신한인증서, "8":toss, "9":뱅크샐러드)
  telecom?: string; // 통신사 ("0":SKT, "1":KT, "2":LG U+)
  certType?: string; // 인증서 구분 ("1":기본인증서, "2":금융인증서)
  certFile?: string; // 인증서 der 파일 (BASE64 인코딩)
  keyFile?: string; // 인증서 key 파일 (BASE64 인코딩)
  certPassword?: string; // 인증서 비밀번호 (RSA 암호화)
  userId?: string; // 아이디 (loginType="1" 필수)
  userPassword?: string; // 비밀번호 (loginType="1" 필수, RSA 암호화)
  manageNo?: string; // 세무대리인 관리번호 (loginType="0" 선택)
  managePassword?: string; // 세무대리인 관리 비밀번호 (loginType="0" 선택, RSA 암호화)
  identity?: string; // 사업자번호/주민등록번호 (신청구분이 세무대리인인 경우 필수)
  birthDate?: string; // 생년월일 (yymmdd, identity가 주민등록번호이고 identityEncYn="Y"인 경우 필수)
  originDataYN?: string; // 원문 DATA 포함 여부 ("1":포함, "0":미포함)
  originDataYN1?: string; // PDF 파일 Base64 데이터 포함 여부 ("1":포함, "0":미포함)
  identityEncYn?: string; // 주민등록번호 뒷자리 암호화 여부 ("Y":암호화, "N":비암호화)
}

export interface TaxCertTwoWayRequest extends Omit<TaxCertRequest, 'signedData'> {
  is2Way: boolean; // 추가 요청임을 알리는 설정값 (true 고정)
  twoWayInfo: {
    jobIndex: number; // 잡 인덱스 (추가 인증 정보)
    threadIndex: number; // 스레드 인덱스 (추가 인증 정보)
    jti: string; // 트랜잭션 아이디 (추가 인증 정보)
    twoWayTimestamp: number; // 추가 인증 시간
  };
  simpleAuth: string; // 간편인증 ("0":cancel, "1":ok)
  signedData?: {
    certSeqNum?: string; // 인증서 일련번호
    signedVals?: string[]; // 전자서명 값 (Array 형태)
    hashedVals?: string[]; // 원문 hash값 (Array 형태)
    hashAlgorithm?: string; // 원문 hash 알고리즘 (SHA256)
  };
  simpleKeyToken?: string; // 간편인증 토큰
  rValue?: string; // 검증 값 (Base64 url-safe 인코딩)
  certificate?: string; // 전자서명을 수행한 인증서
  extraInfo?: any; // 추가 정보
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

export interface CodefResponse {
  result: {
    code: string; // 결과 코드
    message: string; // 결과 메시지
    extraMessage?: string; // 추가 메시지
    transactionId?: string; // 트랜잭션 ID
  };
  data?: TaxCertResponseData; // 응답 데이터
}

// Application Layer DTOs
export interface TaxCertRequestDto extends TaxCertRequest {
  is2Way?: boolean; // 추가인증 요청 여부
}

export interface TaxCertResponseDto {
  success: boolean; // 요청 성공 여부
  data?: CodefResponse; // API 응답 데이터
  error?: string; // 오류 메시지
  duration?: number; // 요청 처리 시간 (ms)
}

export interface TaxCertValidationDto {
  isValid: boolean; // 유효성 검사 통과 여부
  errors: string[]; // 오류 메시지 목록
  missingFields: string[]; // 누락된 필드 목록
} 