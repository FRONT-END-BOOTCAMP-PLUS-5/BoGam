/**
 * 등기부등본 조회 API 응답 DTO
 */

// 공통 응답 필드
export interface BaseRealEstateResponse {
  result: {
    code: string; // 결과 코드
    message: string; // 결과 메시지
  };
}

// 주소 리스트 항목
export interface RealEstateAddressItem {
  resUserNm?: string; // 소유자
  commUniqueNo: string; // 부동산 고유번호
  commAddrLotNumber: string; // 부동산 소재지번
  resState: string; // 상태
  resType?: string; // 구분
}

// 검색 목록 항목
export interface RealEstateSearchItem {
  resType: string; // 구분 (1:매매목록, 2:공동담보/전세목록)
  resNumber: string; // 순번 (갑(을)구 순위번호)
  commUniqueNo: string; // 부동산 고유번호
  commListNumber: string; // 목록번호
  resListType?: string; // 목록종류
}

// 주의사항 항목
export interface RealEstatePrecautionItem {
  resNumber?: string; // 순번
  resContents?: string; // 내용
}

// 상세내역 항목
export interface RealEstateDetailItem {
  resNumber?: string; // 순번
  resContents?: string; // 내용
}

// 내용 항목
export interface RealEstateContentItem {
  resNumber?: string; // 순번
  resType2?: string; // 항목구분(표) (1:제목, 2:내용, 3:공통)
  resDetailList?: RealEstateDetailItem[]; // 상세내역 List
}

// 등기사항 요약 항목
export interface RealEstateRegistrationSummaryItem {
  resType: string; // 구분명 (소유지분현황 (갑구)/소유지분을 제외한 소유권에 관한 사항 (갑구)/(근)저당권 및 전세권 등 (을구)/권리변동 예정사항/개별공시지가/토지이용계획)
  resType1?: string; // 구분상세
  resContentsList: RealEstateContentItem[]; // 내용List
}

// 등기이력 항목
export interface RealEstateRegistrationHistoryItem {
  resType: string; // 구분명 (표제부/갑구..)
  resType1: string; // 구분상세 (토지의표시/소유권에관한 사항/…)
  resContentsList: RealEstateContentItem[]; // 내용List
}

// 등기사항 항목
export interface RealEstateRegisterEntry {
  resIssueNo?: string; // 발급(승인)번호 (YYYYMMDD)
  commUniqueNo: string; // 고유번호
  resDocTitle: string; // 문서제목
  resRealty: string; // 부동산명
  commCompetentRegistryOffice: string; // 관할등기소 (발급인경우 필수)
  resPublishNo?: string; // 발행번호 (발급확인번호, "발급"인경우 필수)
  resPublishDate: string; // 발행일자 (발행일 또는 열람일)
  resPublishRegistryOffice?: string; // 발행등기소
  resPrecautionsList: RealEstatePrecautionItem[]; // 주의사항 List
  resRegistrationSumList: RealEstateRegistrationSummaryItem[]; // 주요 등기사항 요약 List
  resRegistrationHisList: RealEstateRegistrationHistoryItem[]; // 등기이력List
}

// 부동산등기부등본 통합 응답 Entity
export interface RealEstateRegisterResponse extends BaseRealEstateResponse {
  data: {
    // 발행 관련
    commIssueCode?: string; // 발행코드 (2025.02 사이트 개편 이후 미제공)
    resIssueYN: string; // 발행여부 ("0":발행실패(등기사항증명서가 100매 이상일때), "1":발행성공, "2":고유번호조회, "3": 결과처리 실패 (발급성공), "4":발급성공 이후 처리실패 (발급목록에 미발급으로 표시됨))
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
  };
}

// 추가인증 정보 Entity
export interface TwoWayInfo {
  jobIndex: number; // 잡 인덱스
  threadIndex: number; // 스레드 인덱스
  jti: string; // 트렌젝션 아이디
  twoWayTimestamp: number; // 추가 인증 시간
}

// 추가인증 응답 Entity
export interface TwoWayResponse extends BaseRealEstateResponse {
  data: {
    continue2Way: boolean; // 추가 인증 필요 유무 (true : 추가 인증 필요)
    method: string; // 추가 인증 방식
    jobIndex: number; // 잡 인덱스
    threadIndex: number; // 스레드 인덱스
    jti: string; // 트렌젝션 아이디
    twoWayTimestamp: number; // 추가 인증 시간
    extraInfo: {
      resAddrList: RealEstateAddressItem[]; // 주소 List
    }; // 추가정보 Data
  };
}

// 통합 응답 타입 (union type)
export type GetRealEstateResponse = RealEstateRegisterResponse | TwoWayResponse;
