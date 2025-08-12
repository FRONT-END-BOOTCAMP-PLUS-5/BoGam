/**
 * 납세증명서 조회 요청 DTO
 */

export interface Identity {
  reqIdentity: string; // 주민등록번호[13자리]
}

// 기본 납세증명서 요청 인터페이스
export interface BaseTaxCertRequest {
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
  userAddressNickname?: string; // 사용자 주소 닉네임
}

// 2-way 인증 요청 인터페이스
export interface TaxCertTwoWayRequest extends Omit<BaseTaxCertRequest, 'signedData'> {
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
  extraInfo?: {
    simpleKeyToken?: string; // 간편인증 토큰
    rValue?: string; // 검증 값
    certificate?: string; // 전자서명을 수행한 인증서
  }; // 추가 정보
}

// 통합 요청 타입
export type GetTaxCertRequestDto = BaseTaxCertRequest | TaxCertTwoWayRequest;
