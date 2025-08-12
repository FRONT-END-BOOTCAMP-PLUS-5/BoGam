import { DanjiEntity } from '@be/domain/entities/DanjiEntity';

/**
 * 단지목록 조회 API 응답 DTO (원본 구조 유지)
 */
export interface GetDanjiListResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: DanjiEntity[];
}
