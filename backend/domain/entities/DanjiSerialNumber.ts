/**
 * 단지 일련번호 조회 결과 도메인 엔티티
 */
export interface DanjiSerialNumberEntity {
  commBuildingCode: string; // 건물코드 (실거래가 조회 API 입력값으로 사용)
  resBuildingName: string; // 건물명칭
  commAddrLotNumber: string; // 지번
  resBunji: string; // 번지
  commAddrRoadName: string; // 도로명
}
