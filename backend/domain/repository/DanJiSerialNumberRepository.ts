import { DanJiSerialNumber } from '@be/domain/entities/DanJiSerialNumber';
import { DanJiSerialNumberRequest } from '@be/applications/danJiSerialNumber/dtos/DanJiSerialNumberRequest';
import { GetDanJiSerialNumberResponse } from '@be/applications/danJiSerialNumber/dtos/DanJiSerialNumberResponse';

/**
 * 단지 일련번호 조회 리포지토리 인터페이스
 */
export interface DanJiSerialNumberRepository {
  /**
   * 단지 일련번호 조회
   * @param request 조회 요청 파라미터
   * @returns 단지 일련번호 조회 결과
   */
  getDanJiSerialNumber(
    request: DanJiSerialNumberRequest
  ): Promise<GetDanJiSerialNumberResponse>;
}
