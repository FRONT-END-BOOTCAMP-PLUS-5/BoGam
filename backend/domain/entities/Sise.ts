/**
 * 시세정보 조회 API 응답 데이터 Entity
 * CODEF API의 시세정보 조회 응답을 담는 순수한 데이터 클래스
 */
export class SiseEntity {
  constructor(
    public readonly resFixedDate: string, // [시세기준일] YYYYMMDD
    public readonly resType: string, // 구분 (아파트/오피스텔)
    public readonly resComplexName: string, // 단지명 (ex. "화곡동 화곡푸르지오")
    public readonly commAddrRoadName: string, // 주소_도로명 (ex. "서울특별시 강서구 화곡로13길 107")
    public readonly commAddrLotNumber: string, // 주소_지번 (ex. "서울특별시 강서구 화곡동 1091")
    public readonly resCompositionCnt: string, // [단지규모] 세대수 (단위 : 세대)
    public readonly resApprovalDate: string, // [사용승인월] YYYYMM
    public readonly resRealty: string, // [시세도움 협력공인중개사] 부동산명
    public readonly resImageLink: string, // [단지 이미지 URL]
    public readonly resDongCnt?: string, // [단지규모] 동수 (단위 : 동)
    public readonly resHeatingSystem?: string, // [난방형식] (ex. "중앙난방")
    public readonly resFacility?: string, // [주변시설] (ex. "화곡중, 화곡고, 화곡3등주민센터, 서울발산동우체국 ····)
    public readonly resTelNo?: string, // [시세도움 협력공인중개사 전화번호]
    public readonly resAreaPriceList?: Array<{
      resArea: string; // [전용면적] (단위 : ㎡)
      resArea1?: string; // [공급면적] (단위 : ㎡)
      resCompositionCnt: string; // 세대수
      resFloor?: string; // 층
      resLowerAveragePrice: string; // [매매-하한평균가] (단위 : 만원)
      resTopAveragePrice: string; // [매매-상한평균가] (단위 : 만원)
      resLowerAveragePrice1: string; // [전세-하한평균가] (단위 : 만원)
      resTopAveragePrice1: string; // [전세-상한평균가] (단위 : 만원)
      resSuretyAmt: string; // 보증금 (단위 : 만원)
      resMonthlyRent: string; // 월세 (단위 : 만원)
    }>, // [면적별 시세정보] (searchGbn "0" 또는 "1"인 경우 제공)
    public readonly resHoPriceList?: Array<{
      resDong: string; // 동
      resHo: string; // 호
      resArea: string; // [전용면적] (단위 : ㎡)
      resTopPrice: string; // [매매 상한가] (단위 : 만원)
      resLowestPrice: string; // [매매 하한가] (단위 : 만원)
      resTopPrice1: string; // [전세 상한가] (단위 : 만원)
      resLowestPrice1: string; // [전세 하한가] (단위 : 만원)
      resCompositionCnt: string; // 세대수
      resLowerAveragePrice: string; // [매매-하한평균가] (단위 : 만원)
      resTopAveragePrice: string; // [매매-상한평균가] (단위 : 만원)
      resLowerAveragePrice1: string; // [전세-하한평균가] (단위 : 만원)
      resTopAveragePrice1: string; // [전세-상한평균가] (단위 : 만원)
      resSuretyAmt: string; // 보증금 (단위 : 만원)
      resMonthlyRent: string; // 월세 (단위 : 만원)
    }> // [호별 시세정보] (searchGbn "0" 또는 "2"인 경우 제공)
  ) {}
}
