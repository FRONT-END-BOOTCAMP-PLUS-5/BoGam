import { DanjiSerialNumberRepositoryImpl } from '@be/infrastructure/repository/DanJiSerialNumberRepositoryImpl';
import { DanjiSerialNumberRequestDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberRequestDto';
import { GetDanjiSerialNumberResponseDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberResponseDto';

/**
 * 단지 일련번호 조회 CODEF API 요청 UseCase
 * 클린 아키텍처의 Application 레이어
 * CODEF API 호출 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class DanjiSerialNumberUsecase {
  private readonly infrastructure: DanjiSerialNumberRepositoryImpl;

  constructor() {
    this.infrastructure = new DanjiSerialNumberRepositoryImpl();
  }

  // ===== 단지 일련번호 조회 API =====

  /**
   * 단지 일련번호 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getDanjiSerialNumber(
    request: DanjiSerialNumberRequestDto
  ): Promise<GetDanjiSerialNumberResponseDto> {
    return this.infrastructure.getDanjiSerialNumber(request);
  }

  // ===== 응답 검증 및 처리 =====

  /**
   * 조회 결과가 있는지 확인
   * @param response API 응답
   * @returns 조회 결과 존재 여부
   */
  hasData(response: GetDanjiSerialNumberResponseDto): boolean {
    return response.data && response.data.length > 0;
  }

  /**
   * 조회 결과 개수 반환
   * @param response API 응답
   * @returns 조회 결과 개수
   */
  getDataCount(response: GetDanjiSerialNumberResponseDto): number {
    return response.data ? response.data.length : 0;
  }
}
