import { TaxCertRepository } from '@be/domain/repository/TaxCertRepository';
import { TaxCertRequest, TaxCertTwoWayRequest, CodefResponse, TaxCertRequestDto, TaxCertResponseDto, TaxCertValidationDto } from '@be/applications/taxCert/dtos/TaxCertDto';

export class TaxCertUseCase {
  constructor(private taxCertRepository: TaxCertRepository) {}



  async requestTaxCert(request: TaxCertRequestDto): Promise<TaxCertResponseDto> {
    const startTime = Date.now();
    
    try {
      let response: CodefResponse;

      if (request.is2Way) {
        // 추가인증 요청
        const twoWayRequest = request as TaxCertTwoWayRequest;
        response = await this.taxCertRepository.requestTaxCertTwoWay(twoWayRequest);
      } else {
        // 기본 요청
        const { is2Way, ...requestData } = request;
        response = await this.taxCertRepository.requestTaxCert(requestData as TaxCertRequest);
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        data: response,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error('❌ 납세증명서 요청 오류:', {
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '납세증명서 API 호출 중 오류가 발생했습니다.',
        duration
      };
    }
  }
} 