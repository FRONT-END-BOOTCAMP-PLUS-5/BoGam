import { DanJiEntity } from '../../domains/entities/DanJiEntity';

/**
 * 단지목록 조회 요청 DTO
 */
export interface DanJiRequest {
  organization: string; // 기관코드
  addrSido: string; // 주소_시/도
  addrSigun: string; // 주소_시군구
  addrDong: string; // 주소_읍면동
}

/**
 * 단지목록 조회 응답 DTO
 */
export interface DanJiResponse {
  resType: string; // 구분
  resComplexName: string; // 단지명
  commComplexNo: string; // 단지 일련번호
}

/**
 * 단지목록 조회 API 응답 DTO
 */
export interface DanJiApiResponse {
  result: {
    code: string;
    message: string;
  };
  data: DanJiEntity[];
}

/**
 * 단지목록 조회 검증 DTO
 */
export interface DanJiValidationDto {
  isValid: boolean;
  errors: string[];
}
