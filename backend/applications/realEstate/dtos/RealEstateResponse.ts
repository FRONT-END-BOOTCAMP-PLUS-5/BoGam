// 부동산등기부등본 조회 응답 DTO

// 기본 응답 인터페이스
export interface BaseRealEstateResponse {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data?: RealEstateRegisterResponse;
}

// 주소 목록 항목
export interface AddressListItem {
  resUserNm?: string; // 소유자
  commUniqueNo: string; // 부동산 고유번호
  commAddrLotNumber: string; // 부동산 소재지번
  resState: string; // 상태
  resType?: string; // 구분
}

// 검색 목록 항목
export interface SearchListItem {
  resType: string; // 구분 (1:매매목록, 2:공동담보/전세목록)
  resNumber: string; // 순번
  commUniqueNo: string; // 부동산 고유번호
  commListNumber: string; // 목록번호
  resListType?: string; // 목록종류
}

// 주의사항 항목
export interface PrecautionItem {
  resNumber?: string; // 순번
  resContents?: string; // 내용
}

// 상세내역 항목
export interface DetailItem {
  resNumber?: string; // 순번
  resContents?: string; // 내용
}

// 내용 항목
export interface ContentItem {
  resNumber?: string; // 순번
  resType2?: string; // 항목구분 (1:제목, 2:내용)
  resDetailList?: DetailItem[]; // 상세내역 List
}

// 등기사항 요약 항목
export interface RegistrationSummaryItem {
  resType: string; // 구분명
  resType1?: string; // 구분상세
  resContentsList: ContentItem[]; // 내용List
}

// 등기이력 항목
export interface RegistrationHistoryItem {
  resType: string; // 구분명
  resType1: string; // 구분상세
  resContentsList: ContentItem[]; // 내용List
}

// 등기부등본 항목
export interface RealEstateRegisterEntry {
  resIssueNo?: string; // 발급(승인)번호
  commUniqueNo: string; // 고유번호
  resDocTitle: string; // 문서제목
  resRealty: string; // 부동산명
  commCompetentRegistryOffice: string; // 관할등기소
  resPublishNo?: string; // 발행번호
  resPublishDate: string; // 발행일자
  resPublishRegistryOffice?: string; // 발행등기소
  resPrecautionsList: PrecautionItem[]; // 주의사항 List
  resRegistrationSumList: RegistrationSummaryItem[]; // 등기사항 요약 List
  resRegistrationHisList: RegistrationHistoryItem[]; // 등기이력 List
}

// 등기부등본 조회 성공 응답
export interface RealEstateRegisterResponse {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data: {
    commIssueCode?: string; // 발행코드
    resIssueYN: string; // 발행여부
    resTotalPageCount?: string; // 총 페이지 수
    commStartPageNo?: string; // 시작페이지 번호
    resEndPageNo?: string; // 종료페이지 번호
    resWarningMessage?: string; // 경고 메시지
    resOriGinalData?: string; // 원문 DATA (PDF BASE64)
    resAddrList?: AddressListItem[]; // 주소 List
    resSearchList?: SearchListItem[]; // 검색 List
    resRegisterEntriesList?: RealEstateRegisterEntry[]; // 등기사항 List

    // 추가인증 관련
    continue2Way?: boolean; // 추가 인증 필요 유무
    method?: string; // 추가 인증 방식
    jobIndex?: number; // 잡 인덱스
    threadIndex?: number; // 스레드 인덱스
    jti?: string; // 트랜젝션 아이디
    twoWayTimestamp?: number; // 추가 인증 시간
    extraInfo?: {
      resAddrList?: AddressListItem[]; // 주소 List
    };
  };
}

// 2-way 인증 정보
export interface TwoWayInfo {
  jobIndex: number; // 잡 인덱스
  threadIndex: number; // 스레드 인덱스
  jti: string; // 트랜젝션 아이디
  twoWayTimestamp: number; // 추가 인증 시간
}

// 통합 응답 타입
export type GetRealEstateResponse = RealEstateRegisterResponse;
