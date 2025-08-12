import { TaxCertRepository } from '@be/domain/repository/TaxCertRepository';
import {
  GetTaxCertRequestDto,
  BaseTaxCertRequest,
  TaxCertTwoWayRequest,
} from '../dtos/GetTaxCertRequestDto';
import { GetTaxCertResponseDto } from '../dtos/GetTaxCertResponseDto';

/**
 * 납세증명서 조회 Usecase
 * 클린 아키텍처의 Application 레이어
 * 2-way 인증을 포함한 복잡한 납세증명서 발급 로직 처리
 */
export class GetTaxCertUsecase {
  constructor(private taxCertRepository: TaxCertRepository) {}

  async getTaxCert(
    request: GetTaxCertRequestDto
  ): Promise<GetTaxCertResponseDto> {
    const startTime = Date.now();

    try {
      let response: GetTaxCertResponseDto;

      // 2-way 인증 요청인지 확인
      if (this.isTwoWayRequest(request)) {
        // 추가인증 요청
        const twoWayRequest = request as TaxCertTwoWayRequest;
        response = await this.taxCertRepository.requestTaxCertTwoWay(
          twoWayRequest
        );
      } else {
        // 기본 요청
        const baseRequest = request as BaseTaxCertRequest;
        response = await this.taxCertRepository.requestTaxCert(baseRequest);
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        message: '납세증명서 조회 요청이 완료되었습니다.',
        data: response.data,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('❌ 납세증명서 CODEF API 요청 오류:', {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '납세증명서 CODEF API 호출 중 오류가 발생했습니다.',
        duration,
      };
    }
  }

  /**
   * 2-way 인증 필요 여부 확인
   */
  requiresTwoWayAuth(response: GetTaxCertResponseDto): boolean {
    const hasErrorCode = response.data?.result?.code === 'CF-03002';
    const hasContinue2Way =
      response.data?.data &&
      'continue2Way' in response.data.data &&
      (response.data.data as { continue2Way?: boolean }).continue2Way === true;

    return hasErrorCode || Boolean(hasContinue2Way);
  }

  /**
   * 2-way 인증 정보 추출
   */
  extractTwoWayInfo(response: GetTaxCertResponseDto): {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: Record<string, unknown>;
  } | null {
    const data = response.data?.data;
    if (!data || !('continue2Way' in data)) {
      return null;
    }

    const twoWayData = data as {
      jobIndex?: number;
      threadIndex?: number;
      jti?: string;
      twoWayTimestamp?: number;
      method?: string;
      extraInfo?: Record<string, unknown>;
    };

    if (
      typeof twoWayData.jobIndex === 'number' &&
      typeof twoWayData.threadIndex === 'number' &&
      typeof twoWayData.jti === 'string' &&
      typeof twoWayData.twoWayTimestamp === 'number'
    ) {
      return {
        jobIndex: twoWayData.jobIndex,
        threadIndex: twoWayData.threadIndex,
        jti: twoWayData.jti,
        twoWayTimestamp: twoWayData.twoWayTimestamp,
        method: twoWayData.method,
        extraInfo: twoWayData.extraInfo,
      };
    }

    return null;
  }

  /**
   * API 성공 여부 확인 (CODEF 기준)
   */
  isSuccess(response: GetTaxCertResponseDto): boolean {
    return response.data?.result?.code === 'CF-00000';
  }

  /**
   * 2-way 인증 요청인지 확인하는 private 메소드
   */
  private isTwoWayRequest(
    request: GetTaxCertRequestDto
  ): request is TaxCertTwoWayRequest {
    return (
      'is2Way' in request && (request as TaxCertTwoWayRequest).is2Way === true
    );
  }
}
