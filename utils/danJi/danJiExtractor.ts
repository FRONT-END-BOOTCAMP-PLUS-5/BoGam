import { DanJiApiResponse } from '../../backend/applications/danJi/dtos/DanJiDto';

/**
 * 단지목록 조회 데이터 추출 유틸리티
 */
export class DanJiExtractor {
  /**
   * 단지목록 데이터 추출
   * @param response API 응답
   * @returns 단지목록 배열
   */
  static extractDanJiList(response: DanJiApiResponse): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    if (!response.data) {
      return [];
    }

    // 단일 객체인 경우 배열로 변환
    const dataArray = Array.isArray(response.data)
      ? response.data
      : [response.data];

    return dataArray.map((item) => ({
      type: item.resType,
      complexName: item.resComplexName,
      complexNo: item.commComplexNo,
    }));
  }

  /**
   * 단지 타입별 필터링
   * @param response API 응답
   * @param type 단지 타입 (예: "아파트", "연립", "오피스텔")
   * @returns 필터링된 단지목록
   */
  static filterByType(
    response: DanJiApiResponse,
    type: string
  ): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    const allEstates = this.extractDanJiList(response);
    return allEstates.filter((estate) => estate.type.includes(type));
  }

  /**
   * 단지명으로 검색
   * @param response API 응답
   * @param keyword 검색 키워드
   * @returns 검색된 단지목록
   */
  static searchByComplexName(
    response: DanJiApiResponse,
    keyword: string
  ): Array<{
    type: string;
    complexName: string;
    complexNo: string;
  }> {
    const allEstates = this.extractDanJiList(response);
    return allEstates.filter((estate) =>
      estate.complexName.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * 단지 타입별 통계
   * @param response API 응답
   * @returns 단지 타입별 개수
   */
  static getTypeStatistics(response: DanJiApiResponse): Record<string, number> {
    const allEstates = this.extractDanJiList(response);
    const statistics: Record<string, number> = {};

    allEstates.forEach((estate) => {
      statistics[estate.type] = (statistics[estate.type] || 0) + 1;
    });

    return statistics;
  }
}
