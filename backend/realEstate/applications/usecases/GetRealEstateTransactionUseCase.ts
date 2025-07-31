import { GetRealEstateTransactionInfrastructure } from '../../infrastrctures/repositories/GetRealEstateTransactionInfrastructure';
import { GetRealEstateTransactionRequest } from '../dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '../dtos/GetRealEstateTransactionResponse';

/**
 * 실거래가 조회 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class GetRealEstateTransactionUseCase {
  private readonly infrastructure: GetRealEstateTransactionInfrastructure;

  constructor() {
    this.infrastructure = new GetRealEstateTransactionInfrastructure();
  }

  /**
   * 아파트 전월세 실거래가 조회
   */
  async getApartmentRentTransaction(
    request: GetRealEstateTransactionRequest
  ): Promise<GetRealEstateTransactionResponse> {
    return this.infrastructure.getApartmentRentTransaction(request);
  }

  /**
   * 지역코드와 계약년월로 실거래가 조회
   */
  async getTransactionByLocationAndDate(
    lawdCd: string,
    dealYmd: string,
    options: {
      numOfRows?: string;
      pageNo?: string;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    return this.infrastructure.getTransactionByLocationAndDate(
      lawdCd,
      dealYmd,
      options
    );
  }

  /**
   * 응답 검증
   */
  validateResponse(response: GetRealEstateTransactionResponse): {
    isValid: boolean;
    message: string;
    isError: boolean;
  } {
    if (!response) {
      return {
        isValid: false,
        message: '응답 데이터가 없습니다.',
        isError: true,
      };
    }

    // response가 객체이고 header 속성을 가지고 있는지 확인
    if (typeof response === 'object' && response !== null && 'header' in response) {
      const header = response.header;
      
      if (header.resultCode !== '000') {
        return {
          isValid: false,
          message: `API 오류: ${header.resultMsg} (코드: ${header.resultCode})`,
          isError: true,
        };
      }

      return {
        isValid: true,
        message: '실거래가 조회가 성공적으로 완료되었습니다.',
        isError: false,
      };
    }

    return {
      isValid: false,
      message: '잘못된 응답 형식입니다.',
      isError: true,
    };
  }

  /**
   * 실거래가 목록 추출
   */
  getTransactionList(response: GetRealEstateTransactionResponse): Array<{
    aptNm: string;
    buildYear: string;
    dealDate: string;
    deposit: string;
    monthlyRent: string;
    excluUseAr: string;
    floor: string;
    jibun: string;
    umdNm: string;
  }> {
    if (!this.validateResponse(response).isValid) {
      return [];
    }

    if ('body' in response && response.body?.items?.item) {
      return response.body.items.item.map((item) => ({
        aptNm: item.aptNm,
        buildYear: item.buildYear,
        dealDate: `${item.dealYear}-${item.dealMonth}-${item.dealDay}`,
        deposit: item.deposit,
        monthlyRent: item.monthlyRent,
        excluUseAr: item.excluUseAr,
        floor: item.floor,
        jibun: item.jibun,
        umdNm: item.umdNm,
      }));
    }

    return [];
  }
} 