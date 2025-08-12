/**
 * 단지목록 조회 API 응답 데이터 Entity
 * CODEF API의 단지목록 조회 응답을 담는 순수한 데이터 클래스
 */
export class DanjiEntity {
  constructor(
    public readonly resType: string,
    public readonly resComplexName: string,
    public readonly commComplexNo: string
  ) {}
}
