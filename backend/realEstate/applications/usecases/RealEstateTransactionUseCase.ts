import { GetRealEstateTransactionRequest } from '../dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '../dtos/GetRealEstateTransactionResponse';
import { RealEstateTransactionInfrastructure } from '../../infrastrctures/repositories/RealEstateTransactionInfrastructure';

/**
 * 실거래가 조회 유스케이스
 * 클린 아키텍처의 Application 레이어
 */
export class RealEstateTransactionUseCase {
  private readonly infrastructure: RealEstateTransactionInfrastructure;

  constructor() {
    this.infrastructure = new RealEstateTransactionInfrastructure();
  }

  /**
   * 아파트 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.infrastructure.findAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 단독/다가구 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findDetachedHouseAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.infrastructure.findDetachedHouseAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('단독/다가구 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 오피스텔 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findOfficetelAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.infrastructure.findOfficetelAll(request);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('오피스텔 실거래가 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 지역코드와 계약년월로 실거래가 조회 (편의 메서드)
   * @param lawdCd 지역코드 (법정동코드 5자리)
   * @param dealYmd 계약년월 (YYYYMM 형식)
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async findByLocationAndDate(
    lawdCd: string,
    dealYmd: string,
    options: {
      numOfRows?: string;
      pageNo?: string;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    try {
      const response = await this.infrastructure.findByLocationAndDate(lawdCd, dealYmd, options);
      
      // 계약일 포맷팅 (YYYY-MM-DD 형식)
      if (response.body.items.item) {
        response.body.items.item = response.body.items.item.map(item => ({
          ...item,
          dealDate: `${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`,
        }));
      }
      
      return response;
    } catch (error) {
      console.error('지역별 실거래가 조회 실패:', error);
      throw error;
    }
  }
} 