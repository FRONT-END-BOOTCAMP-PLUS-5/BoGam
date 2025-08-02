import { DanJiRepository } from '@be/infrastructure/repository/DanJiRepository';
import {
  DanJiRequest,
  DanJiApiResponse,
} from '@be/applications/danJi/dtos/DanJiDto';

import { DanJiExtractor } from '@utils/danJi/danJiExtractor';

/**
 * 단지목록 조회 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class DanJiUseCase {
  private readonly repository: DanJiRepository;

  constructor(repository: DanJiRepository) {
    this.repository = repository;
  }

  /**
   * 단지목록 조회
   * @param request 단지목록 조회 요청 데이터
   * @returns 단지목록 조회 응답 데이터
   */
  async getDanJiList(request: DanJiRequest): Promise<DanJiApiResponse> {
    // Repository를 통해 API 호출
    return this.repository.fetchDanJiList(request);
  }

  /**
   * 단지목록 데이터 추출
   * @param response API 응답
   * @returns 단지목록 배열
   */
  extractDanJiList(response: DanJiApiResponse): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    return DanJiExtractor.extractDanJiList(response);
  }

  /**
   * 단지 타입별 필터링
   * @param response API 응답
   * @param type 단지 타입 (예: "아파트", "연립", "오피스텔")
   * @returns 필터링된 단지목록
   */
  filterByType(
    response: DanJiApiResponse,
    type: string
  ): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    return DanJiExtractor.filterByType(response, type);
  }

  /**
   * 단지명으로 검색
   * @param response API 응답
   * @param keyword 검색 키워드
   * @returns 검색된 단지목록
   */
  searchByComplexName(
    response: DanJiApiResponse,
    keyword: string
  ): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    return DanJiExtractor.searchByComplexName(response, keyword);
  }

  /**
   * 단지 타입별 통계
   * @param response API 응답
   * @returns 단지 타입별 개수
   */
  getTypeStatistics(response: DanJiApiResponse): Record<string, number> {
    return DanJiExtractor.getTypeStatistics(response);
  }
}
