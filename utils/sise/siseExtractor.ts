import { SiseEntity } from '../../backend/domain/sise/Entities/SiseEntity';

/**
 * 시세정보 데이터 추출 유틸리티
 */
export class SiseExtractor {
  /**
   * 면적별 시세정보 추출
   * @param siseData 시세정보 데이터
   * @returns 면적별 시세정보 배열
   */
  static extractAreaPriceList(
    siseData: SiseEntity
  ): SiseEntity['resAreaPriceList'] {
    return siseData.resAreaPriceList || [];
  }

  /**
   * 호별 시세정보 추출
   * @param siseData 시세정보 데이터
   * @returns 호별 시세정보 배열
   */
  static extractHoPriceList(
    siseData: SiseEntity
  ): SiseEntity['resHoPriceList'] {
    return siseData.resHoPriceList || [];
  }

  /**
   * 단지 기본 정보 추출
   * @param siseData 시세정보 데이터
   * @returns 단지 기본 정보
   */
  static extractBasicInfo(siseData: SiseEntity): {
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
    return {
      complexName: siseData.resComplexName,
      type: siseData.resType,
      fixedDate: siseData.resFixedDate,
      compositionCnt: siseData.resCompositionCnt,
      dongCnt: siseData.resDongCnt,
      approvalDate: siseData.resApprovalDate,
      heatingSystem: siseData.resHeatingSystem,
      realty: siseData.resRealty,
      telNo: siseData.resTelNo,
      addrRoadName: siseData.commAddrRoadName,
      addrLotNumber: siseData.commAddrLotNumber,
    };
  }

  /**
   * 특정 면적의 시세정보 조회
   * @param siseData 시세정보 데이터
   * @param area 면적
   * @returns 해당 면적의 시세정보
   */
  static extractAreaPriceBySize(
    siseData: SiseEntity,
    area: string
  ): NonNullable<SiseEntity['resAreaPriceList']>[0] | undefined {
    return siseData.resAreaPriceList?.find((item) => item.resArea === area);
  }

  /**
   * 특정 동/호의 시세정보 조회
   * @param siseData 시세정보 데이터
   * @param dong 동
   * @param ho 호
   * @returns 해당 동/호의 시세정보
   */
  static extractHoPriceByDongHo(
    siseData: SiseEntity,
    dong: string,
    ho: string
  ): NonNullable<SiseEntity['resHoPriceList']>[0] | undefined {
    return siseData.resHoPriceList?.find(
      (item) => item.resDong === dong && item.resHo === ho
    );
  }
}
