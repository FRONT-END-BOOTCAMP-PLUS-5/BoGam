/**
 * 부동산 공시가격 알리미 개별주택 가격 Entity (클래스 기반)
 * Domain Layer에서 비즈니스 로직을 담당하는 핵심 객체
 */

export class HousingPriceEntity {
  constructor(
    public resReferenceDate: string, // 기준일자 (YYYYMMDD)
    public commAddrBuildingNumber: string, // 건물번호
    public resUserAddr: string, // 주소 (주택소재지)
    public resArea: string, // 면적 (대지면적_전체, 단위: m²)
    public resArea1: string, // 면적1 (대지면적_산정, 단위: m²)
    public resArea2: string, // 면적2 (건물연면적_전체, 단위: m²)
    public resArea3: string, // 면적3 (건물연면적_전체, 단위: m²)
    public resBasePrice: string // 기준가격 (개별주택가격)
  ) {}
}
