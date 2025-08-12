/**
 * 시세정보 조회 요청 DTO
 */
export interface GetSiseInfoRequestDto {
  organization: string; // 기관코드 (고정 값: "0011")
  searchGbn: string; // 조회구분 ("0":전체, "1":면적별 시세정보, "2":호별 시세정보)
  complexNo: string; // 단지 일련번호 (단지정보 조회 API 결과값)
  dong?: string; // 동 (searchGbn "0" 또는 "2"인 경우 필수)
  ho?: string; // 호 (searchGbn "0" 또는 "2"인 경우 필수)

  // 2-way 인증 관련 (선택적)
  is2Way?: boolean;
  secureNo?: string;
  secureNoRefresh?: string;
  dongNum?: string;
  hoNum?: string;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
}
