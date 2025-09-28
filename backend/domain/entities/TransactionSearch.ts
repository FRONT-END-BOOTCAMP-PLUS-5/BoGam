export interface TransactionSearch {
  id: number;
  userAddressId: number;
  transactionSearchData: string; // 암호화된 JSON 데이터
  updatedAt: Date;
}

export interface TransactionSearchData {
  // 기본 검색 정보
  complexName: string; // 단지명
  targetArea: number; // 입력한 전용면적
  targetPrice: number; // 입력한 전세 거래가 (억 단위)
  
  // 검색 결과 정보
  similarArea?: number; // 유사한 전용면적 (없을 수 있음)
  averagePrice?: number; // 해당 면적 매매 평균가 (억 단위, 없을 수 있음)
  searchResultCount: number; // 검색 결과 n건
  
  // 전용면적별 평균가 정보 (없거나 여러개)
  areaAveragePrices?: {
    area: number; // 면적
    averagePrice: number; // 거래평균액 (억 단위)
    transactionCount: number; // 거래 건수
  }[];
}
