import { SiseRepository } from '../../infrastructures/repositories/SiseRepository';
import { SiseEntity } from '../../domains/Entities/SiseEntity';
import { SiseRequest, SiseTwoWayRequest } from '../dtos/SiseDto';
import { SiseValidator } from '../../../../utils/sise/siseValidator';
import { SiseCalculator } from '../../../../utils/sise/siseCalculator';
import { SiseExtractor } from '../../../../utils/sise/siseExtractor';

/**
 * 시세정보 조회 UseCase
 * 클린 아키텍처의 Application 레이어
 * 비즈니스 로직을 담당하며 Infrastructure를 통해 외부 API 호출
 */
export class SiseUseCase {
  private readonly repository: SiseRepository;

  constructor(repository: SiseRepository) {
    this.repository = repository;
  }

  /**
   * 시세정보 조회
   * @param request 시세정보 조회 요청 데이터
   * @returns 시세정보 조회 응답 데이터
   */
  async fetchSiseInfo(
    request: SiseRequest | SiseTwoWayRequest
  ): Promise<SiseEntity> {
    const response = await this.repository.fetchSiseInfo(request);
    const siseData = response.data as SiseEntity;

    return siseData;
  }

  /**
   * 시세정보 데이터 검증
   * @param siseData 시세정보 데이터
   * @returns 검증 결과
   */
  validateSiseData(siseData: SiseEntity): {
    isValid: boolean;
    message: string;
  } {
    return SiseValidator.validateSiseData(siseData);
  }

  /**
   * 면적별 시세정보 추출
   * @param siseData 시세정보 데이터
   * @returns 면적별 시세정보 배열
   */
  extractAreaPriceList(siseData: SiseEntity): SiseEntity['resAreaPriceList'] {
    return SiseExtractor.extractAreaPriceList(siseData);
  }

  /**
   * 호별 시세정보 추출
   * @param siseData 시세정보 데이터
   * @returns 호별 시세정보 배열
   */
  extractHoPriceList(siseData: SiseEntity): SiseEntity['resHoPriceList'] {
    return SiseExtractor.extractHoPriceList(siseData);
  }

  /**
   * 면적별 시세정보 요약
   * @param siseData 시세정보 데이터
   * @returns 면적별 시세정보 요약
   */
  getAreaPriceSummary(siseData: SiseEntity): Array<{
    area: string;
    compositionCnt: string;
    avgPrice: string;
    avgRentPrice: string;
    monthlyRent: string;
  }> {
    const areaPriceList = this.extractAreaPriceList(siseData);
    return SiseCalculator.calculateAreaPriceSummary(areaPriceList);
  }

  /**
   * 호별 시세정보 요약
   * @param siseData 시세정보 데이터
   * @returns 호별 시세정보 요약
   */
  getHoPriceSummary(siseData: SiseEntity): Array<{
    dong: string;
    ho: string;
    area: string;
    avgPrice: string;
    avgRentPrice: string;
    monthlyRent: string;
  }> {
    const hoPriceList = this.extractHoPriceList(siseData);
    return SiseCalculator.calculateHoPriceSummary(hoPriceList);
  }

  /**
   * 단지 기본 정보 추출
   * @param siseData 시세정보 데이터
   * @returns 단지 기본 정보
   */
  getBasicInfo(siseData: SiseEntity): {
    complexName: string;
    type: string;
    fixedDate: string;
    compositionCnt: string;
    dongCnt?: string;
    approvalDate: string;
    heatingSystem?: string;
    realty: string;
    telNo?: string;
    addrRoadName: string;
    addrLotNumber: string;
  } {
    return SiseExtractor.extractBasicInfo(siseData);
  }

  /**
   * 특정 면적의 시세정보 조회
   * @param siseData 시세정보 데이터
   * @param area 면적
   * @returns 해당 면적의 시세정보
   */
  getAreaPriceBySize(
    siseData: SiseEntity,
    area: string
  ): NonNullable<SiseEntity['resAreaPriceList']>[0] | undefined {
    return SiseExtractor.extractAreaPriceBySize(siseData, area);
  }

  /**
   * 특정 동/호의 시세정보 조회
   * @param siseData 시세정보 데이터
   * @param dong 동
   * @param ho 호
   * @returns 해당 동/호의 시세정보
   */
  getHoPriceByDongHo(
    siseData: SiseEntity,
    dong: string,
    ho: string
  ): NonNullable<SiseEntity['resHoPriceList']>[0] | undefined {
    return SiseExtractor.extractHoPriceByDongHo(siseData, dong, ho);
  }
}
