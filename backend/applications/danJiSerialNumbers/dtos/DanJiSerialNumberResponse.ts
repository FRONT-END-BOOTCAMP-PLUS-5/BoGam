import { DanJiSerialNumber } from '@be/domain/entities/DanJiSerialNumber';

/**
 * 단지 일련번호 조회 API 응답 DTO
 */

// 기본 응답 인터페이스
export interface BaseDanJiSerialNumberResponse {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data?: DanJiSerialNumber[];
}

// 단지 일련번호 조회 성공 응답
export interface DanJiSerialNumberResponse
  extends BaseDanJiSerialNumberResponse {
  data: DanJiSerialNumber[];
}

// 통합 응답 타입
export type GetDanJiSerialNumberResponse = DanJiSerialNumberResponse;
