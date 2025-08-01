import { SiseEntity } from '@be/domain/entities/SiseEntity';

// 기본 시세정보 조회 요청 인터페이스
export interface SiseRequest {
  organization: string; // 기관코드 (고정 값: "0011")
  searchGbn: string; // 조회구분 ("0":전체, "1":면적별 시세정보, "2":호별 시세정보)
  complexNo: string; // 단지 일련번호 (단지정보 조회 API 결과값)
  dong?: string; // 동 (searchGbn "0" 또는 "2"인 경우 필수)
  ho?: string; // 호 (searchGbn "0" 또는 "2"인 경우 필수)
}

// 추가인증 요청 인터페이스
export interface SiseTwoWayRequest extends SiseRequest {
  is2Way: boolean; // 추가 요청임을 알리는 설정값 (true 고정)
  secureNo?: string; // 보안문자
  secureNoRefresh?: string; // 보안문자 새로고침 ("0": 기본, "1": 재요청, "2": 입력취소)
  dongNum?: string; // 동번호 (reqDongNumList에서 선택할 동번호)
  hoNum?: string; // 호번호 (reqHoNumList에서 선택할 호번호)
  twoWayInfo: {
    jobIndex: number; // 잡 인덱스
    threadIndex: number; // 스레드 인덱스
    jti: string; // 트랜잭션 아이디
    twoWayTimestamp: number; // 추가 인증 시간
  };
}

export interface TwoWayExtraInfo {
  reqSecureNo?: string; // 보안문자
  reqSecureNoRefresh?: string; // 보안문자 새로고침
  reqDongNumList?: {
    reqDong: string; // 동
    commDongNum: string; // 동 번호
  }; // 동번호 List
  reqHoNumList?: {
    reqHo: string; // 호
    commHoNum: string; // 호 번호
  }; // 호번호 List
}

// 추가인증 응답 인터페이스
export interface TwoWayResponse {
  continue2Way: boolean; // 추가 인증 필요 유무
  method: string; // 추가 인증 방식
  jobIndex: number; // 잡 인덱스
  threadIndex: number; // 스레드 인덱스
  jti: string; // 트랜잭션 아이디
  twoWayTimestamp: number; // 추가 인증 시간
  extraInfo: TwoWayExtraInfo; // 추가정보 Data
}

// API(response) 응답
export interface SiseApiResponse {
  result: {
    code: string;
    message: string;
  };
  data: SiseEntity | TwoWayResponse;
}

export interface SiseValidationDto {
  isValid: boolean;
  errors: string[];
}

export interface SiseRequestDto {
  request: SiseRequest | SiseTwoWayRequest;
  validation: SiseValidationDto;
}
