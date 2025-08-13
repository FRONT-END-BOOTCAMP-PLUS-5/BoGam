/**
 * 단지 일련번호 조회 결과 도메인 엔티티
 */
export class DanjiSerialNumberEntity {
  constructor(
    public readonly commBuildingCode: string, // 건물코드 (실거래가 조회 API 입력값으로 사용)
    public readonly resBuildingName: string, // 건물명칭
    public readonly commAddrLotNumber: string, // 지번
    public readonly resBunji: string, // 번지
    public readonly commAddrRoadName: string // 도로명
  ) {}
}
