import { frontendAxiosInstance } from './axiosInstance';

// 요청 DTO 타입
export interface GetJeonseGuaranteeRequestDto {
  rentGrntAmt: number; // 전세보증금
  trgtLwdgCd: string; // 대상지역코드
  age: number; // 나이
  weddStcd: string; // 결혼상태코드
  myIncmAmt: number; // 내 소득금액
  myTotDebtAmt: number; // 내 총부채금액
  ownHsCnt: number; // 보유주택수
  mmrtAmt: number; // 월세금액
  numOfRows: number; // 페이지 당 행 수
  pageNo: number; // 페이지 번호
}

// 응답 DTO 타입
export interface GetJeonseGuaranteeResponseDto {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  totalCount: number;
  numOfRows: number;
  pageNo: number;
  items: Array<{
    grntDvcd: string; // 보증구분코드
    grntLmtAmt: string; // 보증한도금액
    loanLmtAmt: string; // 대출한도금액
    rcmdProrRnk: number; // 추천순위
  }>;
}

// API 함수
export const getJeonseGuarantee = async (
  data: GetJeonseGuaranteeRequestDto
): Promise<GetJeonseGuaranteeResponseDto> => {
  console.log('data', data);
  const response = await frontendAxiosInstance
    .getAxiosInstance()
    .post('/api/jeonse-guarantee', data);
  return response.data as GetJeonseGuaranteeResponseDto;
};
