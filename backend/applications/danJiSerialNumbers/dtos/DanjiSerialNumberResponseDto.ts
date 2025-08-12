import { DanjiSerialNumberEntity } from '@be/domain/entities/DanjiSerialNumber';

/**
 * 단지 일련번호 조회 API 응답 DTO
 */

// 기본 응답 인터페이스
export interface BaseDanjiSerialNumberResponseDto {
  result: {
    code: string;
    message: string;
    extraMessage?: string;
  };
  data?: DanjiSerialNumberEntity[];
}

// 단지 일련번호 조회 성공 응답
export interface DanjiSerialNumberResponseDto
  extends BaseDanjiSerialNumberResponseDto {
  data: DanjiSerialNumberEntity[];
}

// 통합 응답 타입
export type GetDanjiSerialNumberResponseDto = DanjiSerialNumberResponseDto;
