/**
 * 부동산 공시가격 알리미 개별주택 가격 Entity
 * Domain Layer에서 비즈니스 로직을 담당하는 핵심 객체
 */

export interface HousingPriceItem {
  resReferenceDate: string; // 기준일자 (YYYYMMDD)
  commAddrBuildingNumber: string; // 건물번호
  resUserAddr: string; // 주소 (주택소재지)
  resArea: string; // 면적 (대지면적_전체, 단위: m²)
  resArea1: string; // 면적1 (대지면적_산정, 단위: m²)
  resArea2: string; // 면적2 (건물연면적_전체, 단위: m²)
  resArea3: string; // 면적3 (건물연면적_전체, 단위: m²)
  resBasePrice: string; // 기준가격 (개별주택가격)
}

export interface HousingPriceEntity {
  resHousingPriceList: HousingPriceItem[];
}
