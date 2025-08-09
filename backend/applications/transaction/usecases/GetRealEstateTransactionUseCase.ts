import { GetRealEstateTransactionRequest } from '@be/applications/transaction/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse, GetRealEstateTransactionItem } from '@be/applications/transaction/dtos/GetRealEstateTransactionResponse';
import { RealEstateTransactionRepository } from '@be/infrastructure/repository/RealEstateTransactionRepository';
import { generateDealYearMonthRange, getCurrentYearMonth } from '@utils/dateUtils';

/**
 * 실거래가 조회 유스케이스
 * 클린 아키텍처의 Application 레이어
 */
export class GetRealEstateTransactionUseCase {
  private readonly repository: RealEstateTransactionRepository;

  constructor() {
    this.repository = new RealEstateTransactionRepository();
  }

  /**
   * 연립다세대 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getRowHouseTradeTransactions(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.repository.findRowHouseTradeAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('연립다세대 매매 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 오피스텔 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getOfficetelTradeTransactions(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.repository.findOfficetelTradeAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('오피스텔 매매 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 단독/다가구 매매 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getDetachedHouseTradeTransactions(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.repository.findDetachedHouseTradeAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('단독/다가구 매매 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 아파트 매매 실거래가 조회 (기본)
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async getApartmentTransactions(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.repository.findAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('아파트 매매 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 계약년월 범위로 모든 아파트 실거래가 데이터 수집 (각 월별 페이지네이션)
   * @param lawdCd 지역코드 (법정동코드 5자리)
   * @param startDealYmd 시작 계약년월 (YYYYMM 형식)
   * @param options 추가 옵션
   * @returns 통합된 응답 데이터
   */
  async getAllApartmentTransactionsByDateRange(
    lawdCd: string,
    startDealYmd: string,
    options: {
      maxItems?: number;
      batchSize?: number;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const { maxItems = Infinity, batchSize = 1000 } = options;
      const allItems: GetRealEstateTransactionItem[] = [];
      let firstResponse: GetRealEstateTransactionResponse | null = null;
      
      // 계약년월 범위 생성
      const dealYearMonths = generateDealYearMonthRange(startDealYmd);
      const currentYearMonth = getCurrentYearMonth();
      
      console.log(`🔍 ${lawdCd} 지역 ${startDealYmd}~${currentYearMonth} 아파트 실거래가 범위 수집 시작...`);
      console.log(`📅 수집할 계약년월: ${dealYearMonths.length}개월`);
      
      for (const dealYmd of dealYearMonths) {
        if (allItems.length >= maxItems) {
          console.log(`⚠️ 최대 수집 개수(${maxItems})에 도달하여 중단합니다.`);
          break;
        }
        
        console.log(`📄 ${dealYmd} 아파트 데이터 수집 중... (현재 ${allItems.length}개 수집됨)`);
        
        try {
          // 해당 월의 모든 데이터를 페이지네이션으로 수집
          const monthlyItems: GetRealEstateTransactionItem[] = [];
          let pageNo = 1;
          let monthlyTotalCount = 0;
          let monthlyFirstResponse: GetRealEstateTransactionResponse | null = null;
          
          while (true) {
            const request: GetRealEstateTransactionRequest = {
              LAWD_CD: lawdCd,
              DEAL_YMD: dealYmd,
              numOfRows: batchSize.toString(),
              pageNo: pageNo.toString(),
            };
            
            const response = await this.repository.findAll(request);
            
            // 첫 번째 응답 저장 (헤더 정보용)
            if (!monthlyFirstResponse) {
              monthlyFirstResponse = response;
              monthlyTotalCount = parseInt(response.body.totalCount);
              console.log(`📊 ${dealYmd} 아파트 전체 데이터 수: ${monthlyTotalCount}개`);
            }
            
            if (!firstResponse) {
              firstResponse = response;
            }
            
            if (!response.body.items.item || response.body.items.item.length === 0) {
              console.log(`✅ ${dealYmd} 아파트 더 이상 데이터가 없습니다.`);
              break;
            }
            
            // 계약일 포맷팅 (YYYY-MM-DD 형식)
            const formattedItems = response.body.items.item.map((item: GetRealEstateTransactionItem) => ({
              ...item,
              dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
            }));
            
            monthlyItems.push(...formattedItems);
            
            // 해당 월의 전체 데이터를 다 가져왔는지 확인
            if (monthlyItems.length >= monthlyTotalCount) {
              console.log(`✅ ${dealYmd} 아파트 전체 데이터 수집 완료: ${monthlyItems.length}개`);
              break;
            }
            
            pageNo++;
            
            // 무한 루프 방지
            if (pageNo > 1000) {
              console.warn(`⚠️ ${dealYmd} 아파트 페이지 수가 1000을 초과하여 중단합니다.`);
              break;
            }
          }
          
          allItems.push(...monthlyItems);
          
        } catch (error) {
          console.error(`❌ ${dealYmd} 아파트 데이터 수집 실패:`, error);
          // 개별 월 실패 시에도 계속 진행
        }
      }
      
      console.log(`✅ 아파트 범위 데이터 수집 완료: 총 ${allItems.length}개`);
      
      // 통합된 응답 반환
      if (!firstResponse) {
        throw new Error('아파트 데이터를 가져올 수 없습니다.');
      }
      
      return {
        header: firstResponse.header,
        body: {
          items: { item: allItems },
          numOfRows: allItems.length.toString(),
          pageNo: "1",
          totalCount: allItems.length.toString()
        }
      };
    } catch (error) {
      console.error('아파트 범위 실거래가 수집 실패:', error);
      throw error;
    }
  }

  /**
   * 계약년월 범위로 모든 단독/다가구 실거래가 데이터 수집 (각 월별 페이지네이션)
   */
  async getAllDetachedHouseTransactionsByDateRange(
    lawdCd: string,
    startDealYmd: string,
    options: {
      maxItems?: number;
      batchSize?: number;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const { maxItems = Infinity, batchSize = 1000 } = options;
      const allItems: GetRealEstateTransactionItem[] = [];
      let firstResponse: GetRealEstateTransactionResponse | null = null;
      
      // 계약년월 범위 생성
      const dealYearMonths = generateDealYearMonthRange(startDealYmd);
      const currentYearMonth = getCurrentYearMonth();
      
      console.log(`🔍 ${lawdCd} 지역 ${startDealYmd}~${currentYearMonth} 단독/다가구 실거래가 범위 수집 시작...`);
      console.log(`📅 수집할 계약년월: ${dealYearMonths.length}개월`);
      
      for (const dealYmd of dealYearMonths) {
        if (allItems.length >= maxItems) {
          console.log(`⚠️ 최대 수집 개수(${maxItems})에 도달하여 중단합니다.`);
          break;
        }
        
        console.log(`📄 ${dealYmd} 단독/다가구 데이터 수집 중... (현재 ${allItems.length}개 수집됨)`);
        
        try {
          // 해당 월의 모든 데이터를 페이지네이션으로 수집
          const monthlyItems: GetRealEstateTransactionItem[] = [];
          let pageNo = 1;
          let monthlyTotalCount = 0;
          let monthlyFirstResponse: GetRealEstateTransactionResponse | null = null;
          
          while (true) {
            const request: GetRealEstateTransactionRequest = {
              LAWD_CD: lawdCd,
              DEAL_YMD: dealYmd,
              numOfRows: batchSize.toString(),
              pageNo: pageNo.toString(),
            };
            
            const response = await this.repository.findDetachedHouseTradeAll(request);
            
            // 첫 번째 응답 저장 (헤더 정보용)
            if (!monthlyFirstResponse) {
              monthlyFirstResponse = response;
              monthlyTotalCount = parseInt(response.body.totalCount);
              console.log(`📊 ${dealYmd} 단독/다가구 전체 데이터 수: ${monthlyTotalCount}개`);
            }
            
            if (!firstResponse) {
              firstResponse = response;
            }
            
            if (!response.body.items.item || response.body.items.item.length === 0) {
              console.log(`✅ ${dealYmd} 단독/다가구 더 이상 데이터가 없습니다.`);
              break;
            }
            
            // 계약일 포맷팅 (YYYY-MM-DD 형식)
            const formattedItems = response.body.items.item.map((item: GetRealEstateTransactionItem) => ({
              ...item,
              dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
            }));
            
            monthlyItems.push(...formattedItems);
            
            // 해당 월의 전체 데이터를 다 가져왔는지 확인
            if (monthlyItems.length >= monthlyTotalCount) {
              console.log(`✅ ${dealYmd} 단독/다가구 전체 데이터 수집 완료: ${monthlyItems.length}개`);
              break;
            }
            
            pageNo++;
            
            // 무한 루프 방지
            if (pageNo > 1000) {
              console.warn(`⚠️ ${dealYmd} 단독/다가구 페이지 수가 1000을 초과하여 중단합니다.`);
              break;
            }
          }
          
          allItems.push(...monthlyItems);
          
        } catch (error) {
          console.error(`❌ ${dealYmd} 단독/다가구 데이터 수집 실패:`, error);
          // 개별 월 실패 시에도 계속 진행
        }
      }
      
      console.log(`✅ 단독/다가구 범위 데이터 수집 완료: 총 ${allItems.length}개`);
      
      // 통합된 응답 반환
      if (!firstResponse) {
        throw new Error('단독/다가구 데이터를 가져올 수 없습니다.');
      }
      
      return {
        header: firstResponse.header,
        body: {
          items: { item: allItems },
          numOfRows: allItems.length.toString(),
          pageNo: "1",
          totalCount: allItems.length.toString()
        }
      };
    } catch (error) {
      console.error('단독/다가구 범위 실거래가 수집 실패:', error);
      throw error;
    }
  }

  /**
   * 계약년월 범위로 모든 오피스텔 실거래가 데이터 수집 (각 월별 페이지네이션)
   */
  async getAllOfficetelTransactionsByDateRange(
    lawdCd: string,
    startDealYmd: string,
    options: {
      maxItems?: number;
      batchSize?: number;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const { maxItems = Infinity, batchSize = 1000 } = options;
      const allItems: GetRealEstateTransactionItem[] = [];
      let firstResponse: GetRealEstateTransactionResponse | null = null;
      
      // 계약년월 범위 생성
      const dealYearMonths = generateDealYearMonthRange(startDealYmd);
      const currentYearMonth = getCurrentYearMonth();
      
      console.log(`🔍 ${lawdCd} 지역 ${startDealYmd}~${currentYearMonth} 오피스텔 실거래가 범위 수집 시작...`);
      console.log(`📅 수집할 계약년월: ${dealYearMonths.length}개월`);
      
      for (const dealYmd of dealYearMonths) {
        if (allItems.length >= maxItems) {
          console.log(`⚠️ 최대 수집 개수(${maxItems})에 도달하여 중단합니다.`);
          break;
        }
        
        console.log(`📄 ${dealYmd} 오피스텔 데이터 수집 중... (현재 ${allItems.length}개 수집됨)`);
        
        try {
          // 해당 월의 모든 데이터를 페이지네이션으로 수집
          const monthlyItems: GetRealEstateTransactionItem[] = [];
          let pageNo = 1;
          let monthlyTotalCount = 0;
          let monthlyFirstResponse: GetRealEstateTransactionResponse | null = null;
          
          while (true) {
            const request: GetRealEstateTransactionRequest = {
              LAWD_CD: lawdCd,
              DEAL_YMD: dealYmd,
              numOfRows: batchSize.toString(),
              pageNo: pageNo.toString(),
            };
            
            const response = await this.repository.findOfficetelTradeAll(request);
            
            // 첫 번째 응답 저장 (헤더 정보용)
            if (!monthlyFirstResponse) {
              monthlyFirstResponse = response;
              monthlyTotalCount = parseInt(response.body.totalCount);
              console.log(`📊 ${dealYmd} 오피스텔 전체 데이터 수: ${monthlyTotalCount}개`);
            }
            
            if (!firstResponse) {
              firstResponse = response;
            }
            
            if (!response.body.items.item || response.body.items.item.length === 0) {
              console.log(`✅ ${dealYmd} 오피스텔 더 이상 데이터가 없습니다.`);
              break;
            }
            
            // 계약일 포맷팅 (YYYY-MM-DD 형식)
            const formattedItems = response.body.items.item.map((item: GetRealEstateTransactionItem) => ({
              ...item,
              dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
            }));
            
            monthlyItems.push(...formattedItems);
            
            // 해당 월의 전체 데이터를 다 가져왔는지 확인
            if (monthlyItems.length >= monthlyTotalCount) {
              console.log(`✅ ${dealYmd} 오피스텔 전체 데이터 수집 완료: ${monthlyItems.length}개`);
              break;
            }
            
            pageNo++;
            
            // 무한 루프 방지
            if (pageNo > 1000) {
              console.warn(`⚠️ ${dealYmd} 오피스텔 페이지 수가 1000을 초과하여 중단합니다.`);
              break;
            }
          }
          
          allItems.push(...monthlyItems);
          
        } catch (error) {
          console.error(`❌ ${dealYmd} 오피스텔 데이터 수집 실패:`, error);
          // 개별 월 실패 시에도 계속 진행
        }
      }
      
      console.log(`✅ 오피스텔 범위 데이터 수집 완료: 총 ${allItems.length}개`);
      
      // 통합된 응답 반환
      if (!firstResponse) {
        throw new Error('오피스텔 데이터를 가져올 수 없습니다.');
      }
      
      return {
        header: firstResponse.header,
        body: {
          items: { item: allItems },
          numOfRows: allItems.length.toString(),
          pageNo: "1",
          totalCount: allItems.length.toString()
        }
      };
    } catch (error) {
      console.error('오피스텔 범위 실거래가 수집 실패:', error);
      throw error;
    }
  }

  /**
   * 계약년월 범위로 모든 연립다세대 실거래가 데이터 수집 (각 월별 페이지네이션)
   */
  async getAllRowHouseTransactionsByDateRange(
    lawdCd: string,
    startDealYmd: string,
    options: {
      maxItems?: number;
      batchSize?: number;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const { maxItems = Infinity, batchSize = 1000 } = options;
      const allItems: GetRealEstateTransactionItem[] = [];
      let firstResponse: GetRealEstateTransactionResponse | null = null;
      
      // 계약년월 범위 생성
      const dealYearMonths = generateDealYearMonthRange(startDealYmd);
      const currentYearMonth = getCurrentYearMonth();
      
      console.log(`🔍 ${lawdCd} 지역 ${startDealYmd}~${currentYearMonth} 연립다세대 실거래가 범위 수집 시작...`);
      console.log(`📅 수집할 계약년월: ${dealYearMonths.length}개월`);
      
      for (const dealYmd of dealYearMonths) {
        if (allItems.length >= maxItems) {
          console.log(`⚠️ 최대 수집 개수(${maxItems})에 도달하여 중단합니다.`);
          break;
        }
        
        console.log(`📄 ${dealYmd} 연립다세대 데이터 수집 중... (현재 ${allItems.length}개 수집됨)`);
        
        try {
          // 해당 월의 모든 데이터를 페이지네이션으로 수집
          const monthlyItems: GetRealEstateTransactionItem[] = [];
          let pageNo = 1;
          let monthlyTotalCount = 0;
          let monthlyFirstResponse: GetRealEstateTransactionResponse | null = null;
          
          while (true) {
            const request: GetRealEstateTransactionRequest = {
              LAWD_CD: lawdCd,
              DEAL_YMD: dealYmd,
              numOfRows: batchSize.toString(),
              pageNo: pageNo.toString(),
            };
            
            const response = await this.repository.findRowHouseTradeAll(request);
            
            // 첫 번째 응답 저장 (헤더 정보용)
            if (!monthlyFirstResponse) {
              monthlyFirstResponse = response;
              monthlyTotalCount = parseInt(response.body.totalCount);
              console.log(`📊 ${dealYmd} 연립다세대 전체 데이터 수: ${monthlyTotalCount}개`);
            }
            
            if (!firstResponse) {
              firstResponse = response;
            }
            
            if (!response.body.items.item || response.body.items.item.length === 0) {
              console.log(`✅ ${dealYmd} 연립다세대 더 이상 데이터가 없습니다.`);
              break;
            }
            
            // 계약일 포맷팅 (YYYY-MM-DD 형식)
            const formattedItems = response.body.items.item.map((item: GetRealEstateTransactionItem) => ({
              ...item,
              dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
            }));
            
            monthlyItems.push(...formattedItems);
            
            // 해당 월의 전체 데이터를 다 가져왔는지 확인
            if (monthlyItems.length >= monthlyTotalCount) {
              console.log(`✅ ${dealYmd} 연립다세대 전체 데이터 수집 완료: ${monthlyItems.length}개`);
              break;
            }
            
            pageNo++;
            
            // 무한 루프 방지
            if (pageNo > 1000) {
              console.warn(`⚠️ ${dealYmd} 연립다세대 페이지 수가 1000을 초과하여 중단합니다.`);
              break;
            }
          }
          
          allItems.push(...monthlyItems);
          
        } catch (error) {
          console.error(`❌ ${dealYmd} 연립다세대 데이터 수집 실패:`, error);
          // 개별 월 실패 시에도 계속 진행
        }
      }
      
      console.log(`✅ 연립다세대 범위 데이터 수집 완료: 총 ${allItems.length}개`);
      
      // 통합된 응답 반환
      if (!firstResponse) {
        throw new Error('연립다세대 데이터를 가져올 수 없습니다.');
      }
      
      return {
        header: firstResponse.header,
        body: {
          items: { item: allItems },
          numOfRows: allItems.length.toString(),
          pageNo: "1",
          totalCount: allItems.length.toString()
        }
      };
    } catch (error) {
      console.error('연립다세대 범위 실거래가 수집 실패:', error);
      throw error;
    }
  }
} 