import { CodefAuth, createCodefAuth } from '@libs/codefAuth';
import { DanJiSerialNumberRepositoryImpl } from '@be/infrastructure/repository/DanJiSerialNumberRepositoryImpl';
import { DanJiSerialNumberRequest } from '@be/applications/danJiSerialNumber/dtos/DanJiSerialNumberRequest';
import { GetDanJiSerialNumberResponse } from '@be/applications/danJiSerialNumber/dtos/DanJiSerialNumberResponse';

/**
 * 단지 일련번호 조회 CODEF API 요청 UseCase
 * 클린 아키텍처의 Application 레이어
 * CODEF API 호출 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class DanJiSerialNumberUseCase {
  private readonly infrastructure: DanJiSerialNumberRepositoryImpl;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.infrastructure = new DanJiSerialNumberRepositoryImpl();
    this.codefAuth = createCodefAuth();
  }

  // ===== 인증 관련 =====

  /**
   * 액세스 토큰 획득
   */
  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  // ===== 단지 일련번호 조회 API =====

  /**
   * 단지 일련번호 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getDanJiSerialNumber(
    request: DanJiSerialNumberRequest
  ): Promise<GetDanJiSerialNumberResponse> {
    return this.infrastructure.getDanJiSerialNumber(request);
  }

  // ===== 응답 검증 및 처리 =====

  /**
   * 조회 결과가 있는지 확인
   * @param response API 응답
   * @returns 조회 결과 존재 여부
   */
  hasData(response: GetDanJiSerialNumberResponse): boolean {
    return response.data && response.data.length > 0;
  }

  /**
   * 조회 결과 개수 반환
   * @param response API 응답
   * @returns 조회 결과 개수
   */
  getDataCount(response: GetDanJiSerialNumberResponse): number {
    return response.data ? response.data.length : 0;
  }
}
